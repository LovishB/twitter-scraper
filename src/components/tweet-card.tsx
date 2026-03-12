"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import type { SelectedTweet } from "@/lib/types";

function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const val = n / 1_000_000;
    return val % 1 === 0 ? `${val}M` : `${val.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const val = n / 1_000;
    return val % 1 === 0 ? `${val}K` : `${val.toFixed(1)}K`;
  }
  return String(n);
}

interface TweetCardProps {
  tweet: SelectedTweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tweet.ai_response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initials = tweet.author_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="border-b border-[#cfd9de] px-4 py-3 transition-colors duration-200 hover:bg-[#f7f9f9]">
      {/* Author row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {tweet.author_profile_picture ? (
          <img
            src={tweet.author_profile_picture}
            alt={tweet.author_name}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cfd9de] text-[13px] font-bold text-white">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          {/* Name line */}
          <div className="flex items-center gap-1">
            <span className="truncate text-[15px] font-bold text-[#0f1419]">
              {tweet.author_name}
            </span>
            {tweet.author_is_blue_verified && (
              <svg
                viewBox="0 0 22 22"
                className="h-[18px] w-[18px] shrink-0 fill-[#1d9bf0]"
                aria-label="Verified account"
              >
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.141.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.224 1.261.272 1.894.141.636-.132 1.22-.437 1.69-.882.445-.47.75-1.055.88-1.69.131-.634.084-1.292-.139-1.9.584-.272 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
              </svg>
            )}
            <span className="truncate text-[15px] text-[#536471]">
              @{tweet.author_username}
            </span>
          </div>

          {/* Tweet text */}
          <p className="mt-1 whitespace-pre-wrap text-[15px] leading-5 text-[#0f1419]">
            {tweet.text}
          </p>

          {/* Engagement stats */}
          <div className="mt-3 flex items-center gap-5">
            {/* Likes */}
            <span className="flex items-center gap-1.5 text-[13px] text-[#536471]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.965 3.03 4.294 6.82 7.345l.306.248.296-.25c3.79-3.04 5.74-5.37 6.82-7.34 1.11-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-3.653 5.12-7.695 8.413l-.252.208-.253-.209c-4.032-3.29-6.332-5.93-7.686-8.41-1.39-2.55-1.39-4.87-.404-6.86C5.502 4.4 7.26 3.46 9.14 3.5c1.64.06 3.17.9 4.22 2.37.33-.47.7-.9 1.1-1.26.66-.6 1.43-1.01 2.27-1.11 1.87-.2 3.63.7 4.56 2.83.98 1.99.98 4.31-.404 6.86z" />
              </svg>
              {formatCount(tweet.like_count)}
            </span>

            {/* Retweets */}
            <span className="flex items-center gap-1.5 text-[13px] text-[#536471]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
              </svg>
              {formatCount(tweet.retweet_count)}
            </span>

            {/* Views */}
            <span className="flex items-center gap-1.5 text-[13px] text-[#536471]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M8.75 21V3h2v18h-2zM18.75 21V8.5h2V21h-2zM13.75 21v-9h2v9h-2zM3.75 21v-4h2v4h-2z" />
              </svg>
              {formatCount(tweet.view_count)}
            </span>
          </div>

          {/* Relevance */}
          {tweet.relevance_score !== null && (
            <div className="mt-3">
              <Badge
                variant="secondary"
                className="h-[20px] rounded-[4px] bg-[#1d9bf0]/10 px-1.5 text-[11px] font-semibold text-[#1d9bf0]"
              >
                Relevance: {tweet.relevance_score}
              </Badge>
            </div>
          )}

          {/* AI Response */}
          <div className="mt-3 rounded-xl border border-[#eff3f4] bg-[#f7f9f9] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#0f1419]">
                AI Response
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleCopy}
                className="h-7 rounded-full px-3 text-[12px] text-[#536471] hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]"
              >
                {copied ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="mr-1 h-3.5 w-3.5 fill-current"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="mr-1 h-3.5 w-3.5 fill-current"
                    >
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="whitespace-pre-wrap text-[14px] leading-5 text-[#0f1419]">
              {tweet.ai_response}
            </p>
          </div>

          {/* View on X link */}
          <div className="mt-3">
            <a
              href={tweet.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" }) + " rounded-full border-[#eff3f4] text-[13px] font-bold text-[#1d9bf0] hover:bg-[#1d9bf0]/10 no-underline"}
            >
              <svg
                viewBox="0 0 24 24"
                className="mr-1.5 h-4 w-4 fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              View on X
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
