// app/api/versions/[id]/improvements/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await params;
    const versionId = resolvedParams.id;
    const supabase = await createClient();

    // Check user authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch improvements for the specific version
    const { data: improvements, error } = await supabase
      .from("improvements")
      .select(
        `
        id,
        original_text,
        suggested_text,
        explanation,
        created_at,
        updated_at
      `
      )
      .eq("version_id", versionId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Verify that the version belongs to the authenticated user
    const { data: version } = await supabase
      .from("versions")
      .select("session_id")
      .eq("id", versionId)
      .single();

    if (version) {
      const { data: session } = await supabase
        .from("sessions")
        .select("user_id")
        .eq("id", version.session_id)
        .single();

      if (session?.user_id !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.json({ improvements });
  } catch (error) {
    console.error("Error fetching improvements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
