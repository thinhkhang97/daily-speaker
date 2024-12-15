import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: latestVersion } = await supabase
    .from("versions")
    .select("id, transcript, version_number")
    .eq("session_id", resolvedParams.id)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({
    id: latestVersion?.id,
    version_number: latestVersion?.version_number,
    transcript: latestVersion?.transcript,
  });
}
