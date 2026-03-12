import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("filter_prompt")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { filtering_prompt } = body;

  // Get the single filter_prompt row
  const { data: existing } = await supabase
    .from("filter_prompt")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Filter prompt not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("filter_prompt")
    .update({ filtering_prompt, updated_at: new Date().toISOString() })
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
