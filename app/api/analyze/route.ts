import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, sessionId, versionNumber } = await req.json();
    const supabase = await createClient();

    // 1. Get OpenAI analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `
          # Speech Analysis Prompt

Please analyze my speaking/writing below:

${text}

For your analysis, please:

1. Highlight specific sentences or phrases that could be improved
   - Original: [Quote the original sentence]
   - Issue: [Brief explanation of why it needs improvement]
   - Better version: [Provide a clearer, more effective way to express the same idea]

2. Focus on:
   - Unclear or awkward phrasing
   - Overly complex sentences
   - Grammar and word choice issues
   - Run-on sentences
   - Redundant expressions

3. Keep explanations brief but specific, so I understand exactly what to improve.

Please format your response in json format
{
  "analysis": [
    {
      "original": "[sentence that needs improvement]",
      "better": "[improved version]",
      "why": [One-line explanation of the improvement]
    }
  ]
}
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
      return NextResponse.json({ error: "No content" }, { status: 400 });
    }

    const analysisResult = JSON.parse(completion.choices[0].message.content);
    console.log("🚀 ~ POST ~ analysisResult:", analysisResult);

    // 2. Create new version
    const { data: versionData, error: versionError } = await supabase
      .from("versions")
      .insert({
        session_id: sessionId,
        transcript: text,
        version_number: versionNumber,
      })
      .select()
      .single();

    if (versionError) {
      throw versionError;
    }

    // 3. Create improvements
    const improvementPromises = analysisResult.analysis.map((item: any) => {
      return supabase.from("improvements").insert({
        version_id: versionData.id,
        original_text: item.original,
        suggested_text: item.better,
        explanation: item.why,
      });
    });

    await Promise.all(improvementPromises);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
