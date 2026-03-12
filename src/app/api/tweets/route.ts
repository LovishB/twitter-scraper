import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

/** Round up to the next UTC 00:00 or 12:00 boundary */
function nextUTC12hBoundary(date: Date): Date {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  const h = d.getUTCHours();
  // If exactly on boundary, go to next one
  if (h < 12) {
    d.setUTCHours(12);
  } else {
    d.setUTCHours(24);
  }
  // If the boundary equals the original time exactly, keep it
  // Otherwise, it's already the next boundary
  return d;
}

const emptyResponse = {
  tweets: [],
  total: 0,
  page: 1,
  totalPages: 1,
  windowStart: null,
  windowEnd: null,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");

  const { data: allTweets, error: allError } = await supabase
    .from("selected_tweets")
    .select("created_at")
    .order("created_at", { ascending: false });

  if (allError) {
    return NextResponse.json({ error: allError.message }, { status: 500 });
  }

  if (!allTweets || allTweets.length === 0) {
    return NextResponse.json(emptyResponse);
  }

  const timestamps = allTweets.map((t) => new Date(t.created_at).getTime());
  const newestTs = timestamps[0];
  const oldestTs = timestamps[timestamps.length - 1];

  // Walk backward from the boundary after the newest tweet
  const windows: { start: Date; end: Date }[] = [];
  let endTs = nextUTC12hBoundary(new Date(newestTs)).getTime();

  while (endTs - TWELVE_HOURS <= newestTs && endTs > oldestTs - TWELVE_HOURS) {
    const startTs = endTs - TWELVE_HOURS;

    const hasTweets = timestamps.some((ts) => ts >= startTs && ts < endTs);

    if (hasTweets) {
      windows.push({ start: new Date(startTs), end: new Date(endTs) });
    }

    endTs = startTs;
  }

  if (windows.length === 0) {
    return NextResponse.json(emptyResponse);
  }

  const totalPages = windows.length;
  const safeIndex = Math.min(Math.max(page - 1, 0), totalPages - 1);
  const win = windows[safeIndex];

  const { data, error } = await supabase
    .from("selected_tweets")
    .select("*")
    .gte("created_at", win.start.toISOString())
    .lt("created_at", win.end.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    tweets: data,
    total: data?.length || 0,
    page: safeIndex + 1,
    totalPages,
    windowStart: win.start.toISOString(),
    windowEnd: win.end.toISOString(),
  });
}
