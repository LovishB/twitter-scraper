"use client";

import { useState } from "react";
import { toast } from "sonner";

export function FetchButton() {
  const [loading, setLoading] = useState(false);

  async function handleFetch() {
    setLoading(true);
    try {
      const res = await fetch("/api/fetch", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");
      if (data.message) {
        toast(data.message);
      } else {
        toast(`Fetched ${data.fetched} tweets, ${data.selected ?? 0} selected`);
        window.location.reload();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFetch}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-full bg-[#1d9bf0] px-4 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-[#1a8cd8] disabled:opacity-50"
    >
      {loading ? (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 11-6.22-8.56" />
          <polyline points="21 3 21 12 12 12" />
        </svg>
      )}
      {loading ? "Fetching..." : "Fetch Now"}
    </button>
  );
}
