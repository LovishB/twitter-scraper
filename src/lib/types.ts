export interface Keyword {
  id: string;
  keyword: string;
  is_active: boolean;
  created_at: string;
}

export interface FilterPrompt {
  id: string;
  filtering_prompt: string;
  created_at: string;
  updated_at: string;
}

export interface RawTweet {
  id: string;
  tweet_id: string;
  keyword_id: string;
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
  author_id: string;
  author_username: string;
  author_name: string;
  author_profile_picture: string | null;
  author_is_blue_verified: boolean;
  author_followers: number;
  author_description: string | null;
  created_at_twitter: string;
  fetched_at: string;
}

export interface SelectedTweet {
  id: string;
  raw_tweet_id: string;
  tweet_id: string;
  text: string;
  url: string;
  author_username: string;
  author_name: string;
  author_profile_picture: string | null;
  author_is_blue_verified: boolean;
  author_followers: number;
  like_count: number;
  retweet_count: number;
  view_count: number;
  ai_response: string;
  relevance_score: number | null;
  keyword: string;
  created_at: string;
}
