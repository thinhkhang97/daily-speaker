import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: versions } = await supabase
    .from("versions")
    .select("id, transcript, version_number, created_at, updated_at, audio_url")
    .eq("session_id", resolvedParams.id)
    .order("version_number", { ascending: false });
  console.log("🚀 ~ versions:", versions);

  return NextResponse.json(versions);
}
