import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AnalysisItem {
  original: string;
  better: string;
  why: string;
}

// const mockResult = {
//   analysis: [
//     {
//       original: "I usually wake up at half-five o'clock.",
//       better: "I usually wake up at five-thirty.",
//       why: "Improves clarity and uses more common time expression.",
//     },
//     {
//       original: "I cannot sleep more because I feel that is enough.",
//       better: "I can't sleep more because I feel that's enough sleep for me.",
//       why: "Provides clearer reasoning and avoids repetition.",
//     },
//     {
//       original:
//         "So if I need to go to the office in the morning, I need to repair the meal for lunch and some time for my dinner.",
//       better:
//         "So if I go to the office in the morning, I need to prepare lunch and sometimes dinner in advance.",
//       why: "Clarifies the sentence and corrects misused word 'repair' to 'prepare'.",
//     },
//     {
//       original:
//         "So in the morning, we spend lots of time for exercising and cooking and then I go to work at 9 a.m. or 10 a.m. but it depends on my routine.",
//       better:
//         "In the morning, we spend a lot of time exercising and cooking before I head to work at 9 a.m. or 10 a.m., depending on my schedule.",
//       why: "Improves flow and clarity.",
//     },
//     {
//       original:
//         "So about an evening, I usually come home at 6 p.m. and had dinner before 7 o'clock because I am in a dia so I don't want to have dinner late.",
//       better:
//         "In the evening, I usually come home by 6 p.m. and have dinner before 7 o'clock because I am dieting and don't want to eat late.",
//       why: "Clarifies the time of day, corrects tense, and clarifies 'in a dia' to 'dieting'.",
//     },
//     {
//       original:
//         "But I usually start at home to learn the new things or to try some new technology or researching.",
//       better:
//         "But at home, I usually spend time learning new things, trying out new technologies, or doing research.",
//       why: "Improves flow and specificity.",
//     },
//     {
//       original:
//         "I and my wife also cook some delicious meals or go to some places to enjoy the weekend.",
//       better:
//         "My wife and I also cook delicious meals or visit places to enjoy the weekend.",
//       why: "Corrects the grammatical structure and simplifies the wording.",
//     },
//     {
//       original:
//         "So I think my routine kind of come on but I still enjoy routine with my wife.",
//       better:
//         "So I think my routine is somewhat common, but I still enjoy it with my wife.",
//       why: "Clarifies the meaning and corrects grammatical issues.",
//     },
//   ],
// };

const TextAnalysis = ({ text }: { text: string }) => {
  const [analysis, setAnalysis] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Error analyzing text:", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Speech Analysis</h2>
      <div className="space-y-4 h-[calc(100%-2rem)]">
        <Button
          onClick={analyzeText}
          disabled={!text || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Speech"
          )}
        </Button>

        <div className="overflow-auto h-[calc(100%-4rem)]">
          {analysis.length > 0 && (
            <div className="space-y-6">
              {analysis.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="border-l-4 border-red-400 pl-4">
                    <div className="text-sm text-gray-500 mb-1">Original</div>
                    <div className="text-gray-700">{item.original}</div>
                  </div>

                  <div className="border-l-4 border-green-400 pl-4">
                    <div className="text-sm text-gray-500 mb-1">Better</div>
                    <div className="text-gray-700">{item.better}</div>
                  </div>

                  <div className="text-sm text-gray-500 italic pl-4">
                    Why: {item.why}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextAnalysis;
