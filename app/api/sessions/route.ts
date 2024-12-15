import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await request.json();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        id: session.id,
        title: session.title,
        user_id: session.user_id,
        created_at: session.createdAt,
        updated_at: session.updatedAt,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
