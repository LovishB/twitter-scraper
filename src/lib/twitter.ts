export interface TwitterApiTweet {
  tweet_id: string;
  text: string;
  url: string;
  lang: string | null;
  is_reply: boolean;
  like_count: number;
  retweet_count: number;
  reply_count: number;
  quote_count: number;
  view_count: number;
  bookmark_count: number;
  created_at_twitter: string;
  author_id: string;
  author_username: string;
  author_name: string;
  author_profile_picture: string | null;
  author_is_blue_verified: boolean;
  author_followers: number;
  author_description: string | null;
}

export async function searchTweets(
  query: string,
  maxTweets: number = 50
): Promise<TwitterApiTweet[]> {
  const apiKey = process.env.TWITTER_API_KEY;
  console.log("TWITTER_API_KEY present:", !!apiKey, "length:", apiKey?.length);
  if (!apiKey) {
    throw new Error("TWITTER_API_KEY environment variable is not set");
  }

  const tweets: TwitterApiTweet[] = [];
  let cursor: string | undefined;
  let isFirstRequest = true;

  while (tweets.length < maxTweets) {
    // Free tier: 1 request per 5 seconds
    if (!isFirstRequest) {
      await new Promise((resolve) => setTimeout(resolve, 5500));
    }
    isFirstRequest = false;
    const params = new URLSearchParams({
      query,
      queryType: "Latest",
    });
    if (cursor) {
      params.set("cursor", cursor);
    }

    const url = `https://api.twitterapi.io/twitter/tweet/advanced_search?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Twitter API error body:", errorBody);
      console.error("Request URL:", url);
      throw new Error(
        `Twitter API request failed: ${response.status} ${response.statusText} — ${errorBody}`
      );
    }

    const data = (await response.json()) as {
      tweets: any[];
      has_next_page: boolean;
      next_cursor: string;
    };

    if (!data.tweets || data.tweets.length === 0) {
      break;
    }

    for (const t of data.tweets) {
      if (tweets.length >= maxTweets) break;

      tweets.push({
        tweet_id: t.id,
        text: t.text,
        url: t.url,
        lang: t.lang ?? null,
        is_reply: t.isReply,
        like_count: t.likeCount,
        retweet_count: t.retweetCount,
        reply_count: t.replyCount,
        quote_count: t.quoteCount,
        view_count: t.viewCount,
        bookmark_count: t.bookmarkCount,
        created_at_twitter: t.createdAt,
        author_id: t.author.id,
        author_username: t.author.userName,
        author_name: t.author.name,
        author_profile_picture: t.author.profilePicture ?? null,
        author_is_blue_verified: t.author.isBlueVerified,
        author_followers: t.author.followers,
        author_description: t.author.description ?? null,
      });
    }

    if (!data.has_next_page) {
      break;
    }

    cursor = data.next_cursor;
  }

  return tweets;
}
