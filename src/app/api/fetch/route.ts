import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { searchTweets } from "@/lib/twitter";
import { filterAndGenerateReplies } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1. Fetch all active keywords
    const { data: keywords } = await supabase
      .from("keywords")
      .select("*")
      .eq("is_active", true);

    if (!keywords || keywords.length === 0) {
      return NextResponse.json(
        { success: true, message: "No active keywords" },
        { status: 200 }
      );
    }

    // 2. Build combined search query
    const combinedQuery = keywords
      .map((k) => {
        const term = k.keyword as string;
        return term.includes(" ") ? `"${term}"` : term;
      })
      .join(" OR ");

    // 3. Search tweets
    console.log("Manual fetch - Combined query:", combinedQuery);
    const tweets = await searchTweets(combinedQuery, 5);

    // 4. Upsert results into raw_tweets
    const rows = tweets.map((tweet) => ({
      tweet_id: tweet.tweet_id,
      keyword_id: keywords[0].id,
      text: tweet.text,
      url: tweet.url,
      lang: tweet.lang,
      is_reply: tweet.is_reply,
      like_count: tweet.like_count,
      retweet_count: tweet.retweet_count,
      reply_count: tweet.reply_count,
      quote_count: tweet.quote_count,
      view_count: tweet.view_count,
      bookmark_count: tweet.bookmark_count,
      author_id: tweet.author_id,
      author_username: tweet.author_username,
      author_name: tweet.author_name,
      author_profile_picture: tweet.author_profile_picture,
      author_is_blue_verified: tweet.author_is_blue_verified,
      author_followers: tweet.author_followers,
      author_description: tweet.author_description,
      created_at_twitter: tweet.created_at_twitter,
      fetched_at: new Date().toISOString(),
    }));

    if (rows.length > 0) {
      await supabase
        .from("raw_tweets")
        .upsert(rows, { onConflict: "tweet_id" });
    }

    // 5. AI filtering
    const { data: settings } = await supabase
      .from("filter_prompt")
      .select("filtering_prompt")
      .limit(1)
      .single();

    if (settings?.filtering_prompt && tweets.length > 0) {
      console.log("Manual fetch - Starting AI filtering...");

      const tweetsForAI = tweets.map((t) => ({
        tweet_id: t.tweet_id,
        text: t.text,
        author_username: t.author_username,
        author_name: t.author_name,
      }));

      const aiResults = await filterAndGenerateReplies(
        tweetsForAI,
        settings.filtering_prompt
      );

      console.log("Manual fetch - AI returned", aiResults.length, "selected tweets");

      const selectedTweetIds = aiResults.map((r) => r.tweet_id);
      const { data: rawTweetRows } = await supabase
        .from("raw_tweets")
        .select("id, tweet_id")
        .in("tweet_id", selectedTweetIds);
      const rawTweetMap = new Map(
        (rawTweetRows || []).map((r) => [r.tweet_id, r.id])
      );

      const selectedRows = aiResults
        .map((result) => {
          const tweet = tweets.find((t) => t.tweet_id === result.tweet_id);
          if (!tweet) return null;
          return {
            raw_tweet_id: rawTweetMap.get(result.tweet_id) || null,
            tweet_id: tweet.tweet_id,
            text: tweet.text,
            url: tweet.url,
            author_username: tweet.author_username,
            author_name: tweet.author_name,
            author_profile_picture: tweet.author_profile_picture,
            author_is_blue_verified: tweet.author_is_blue_verified,
            author_followers: tweet.author_followers,
            like_count: tweet.like_count,
            retweet_count: tweet.retweet_count,
            view_count: tweet.view_count,
            ai_response: result.reply,
            relevance_score: result.relevance_score,
            keyword: combinedQuery,
          };
        })
        .filter((row): row is NonNullable<typeof row> => row !== null);

      if (selectedRows.length > 0) {
        await supabase.from("selected_tweets").insert(selectedRows);
      }

      return NextResponse.json({
        success: true,
        fetched: tweets.length,
        selected: selectedRows.length,
      });
    }

    return NextResponse.json({ success: true, fetched: tweets.length });
  } catch (error) {
    console.error("Manual fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
