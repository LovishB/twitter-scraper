"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TweetCard } from "@/components/tweet-card";
import type { SelectedTweet } from "@/lib/types";

function formatWindowDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) + " " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function TweetList() {
  const [tweets, setTweets] = useState<SelectedTweet[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [windowStart, setWindowStart] = useState<string | null>(null);
  const [windowEnd, setWindowEnd] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tweets?page=${page}`);
        const data = await res.json();
        setTweets(data.tweets ?? []);
        setTotalPages(data.totalPages ?? 1);
        setWindowStart(data.windowStart ?? null);
        setWindowEnd(data.windowEnd ?? null);
      } catch {
        setTweets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg
          className="h-8 w-8 animate-spin text-[#1d9bf0]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          viewBox="0 0 24 24"
          className="mb-3 h-10 w-10 fill-[#cfd9de]"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <p className="text-[15px] font-bold text-[#0f1419]">No tweets yet</p>
        <p className="mt-1 text-[13px] text-[#536471]">
          Tweets will appear here once scraped and filtered.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Time window header */}
      {windowStart && windowEnd && (
        <div className="border-b border-[#cfd9de] px-4 py-3">
          <p className="text-[13px] font-bold text-[#0f1419]">
            {formatWindowDate(windowStart)} — {formatWindowDate(windowEnd)}
          </p>
          <p className="mt-0.5 text-[12px] text-[#536471]">
            {tweets.length} tweet{tweets.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      {/* Tweet feed */}
      <div>
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-[#cfd9de] py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-full border-[#eff3f4] text-[13px] font-bold text-[#0f1419] hover:bg-[#f7f9f9] disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              className="mr-1 h-4 w-4 fill-current"
            >
              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
            </svg>
            Newer
          </Button>

          <span className="text-[13px] text-[#536471]">
            Page{" "}
            <span className="font-bold text-[#0f1419]">{page}</span>
            {" "}of{" "}
            <span className="font-bold text-[#0f1419]">{totalPages}</span>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-full border-[#eff3f4] text-[13px] font-bold text-[#0f1419] hover:bg-[#f7f9f9] disabled:opacity-40"
          >
            Older
            <svg
              viewBox="0 0 24 24"
              className="ml-1 h-4 w-4 fill-current"
            >
              <path d="M16.586 11L11.543 5.96l1.414-1.42L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586z" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
