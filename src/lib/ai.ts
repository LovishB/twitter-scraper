import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export interface AIFilterResult {
  tweet_id: string;
  relevance_score: number;
  reply: string;
}

interface TweetInput {
  tweet_id: string;
  text: string;
  author_username: string;
  author_name: string;
}

export async function filterAndGenerateReplies(
  tweets: TweetInput[],
  filteringPrompt: string
): Promise<AIFilterResult[]> {
  if (tweets.length === 0) {
    return [];
  }

  const formattedTweets = tweets
    .map(
      (t) => `[${t.tweet_id}] @${t.author_username} (${t.author_name}): ${t.text}`
    )
    .join("\n");

  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

  let response: OpenAI.Chat.Completions.ChatCompletion;

  try {
    response = await client.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You are a Twitter engagement assistant. You filter tweets based on the user\'s criteria and craft genuine, helpful replies for the ones that pass. Return ONLY valid JSON with this exact structure: { "results": [{ "tweet_id": "...", "relevance_score": 0.0-1.0, "reply": "..." }] }. Only include tweets that match the filtering criteria. If no tweets match, return { "results": [] }.',
        },
        {
          role: "user",
          content: `Filtering criteria: ${filteringPrompt}\n\nTweets:\n${formattedTweets}`,
        },
      ],
    });
  } catch (error) {
    throw new Error(
      `OpenRouter API call failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const rawContent = response.choices[0]?.message?.content;

  if (!rawContent) {
    console.error("AI returned empty response content");
    return [];
  }

  try {
    const parsed = JSON.parse(rawContent) as { results: AIFilterResult[] };
    return parsed.results ?? [];
  } catch {
    console.error("Failed to parse AI response as JSON. Raw response:", rawContent);
    return [];
  }
}
