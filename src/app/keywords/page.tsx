"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KeywordForm } from "@/components/keyword-form";
import { KeywordList } from "@/components/keyword-list";
import { toast } from "sonner";
import type { Keyword } from "@/lib/types";

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [filteringPrompt, setFilteringPrompt] = useState("");
  const [savedPrompt, setSavedPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);

  const fetchKeywords = useCallback(async () => {
    try {
      const res = await fetch("/api/keywords");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setKeywords(data);
    } catch {
      toast.error("Failed to load keywords");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/filter-prompt");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFilteringPrompt(data.filtering_prompt || "");
      setSavedPrompt(data.filtering_prompt || "");
    } catch {
      toast.error("Failed to load settings");
    }
  }, []);

  useEffect(() => {
    fetchKeywords();
    fetchSettings();
  }, [fetchKeywords, fetchSettings]);

  const handleSavePrompt = async () => {
    setSavingPrompt(true);
    try {
      const res = await fetch("/api/filter-prompt", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filtering_prompt: filteringPrompt }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSavedPrompt(filteringPrompt);
      toast.success("Filtering prompt saved");
    } catch {
      toast.error("Failed to save filtering prompt");
    } finally {
      setSavingPrompt(false);
    }
  };

  const handleSave = async (data: { keyword: string }) => {
    try {
      if (editingKeyword) {
        const res = await fetch("/api/keywords", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingKeyword.id, ...data }),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast.success("Keyword updated");
      } else {
        const res = await fetch("/api/keywords", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create");
        toast.success("Keyword added");
      }
      setFormOpen(false);
      setEditingKeyword(null);
      fetchKeywords();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/keywords?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Keyword deleted");
      fetchKeywords();
    } catch {
      toast.error("Failed to delete keyword");
    }
  };

  const handleToggleActive = async (keyword: Keyword) => {
    try {
      const res = await fetch("/api/keywords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: keyword.id, is_active: !keyword.is_active }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(
        keyword.is_active ? "Keyword deactivated" : "Keyword activated"
      );
      fetchKeywords();
    } catch {
      toast.error("Failed to update keyword");
    }
  };

  const promptChanged = filteringPrompt !== savedPrompt;

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:divide-x md:divide-[#cfd9de]">
        {/* Left — Filtering AI Prompt */}
        <div className="md:pr-6">
          <h2 className="text-[15px] font-bold text-[#0f1419]">
            Filtering AI Prompt
          </h2>
          <p className="mt-0.5 text-[13px] text-[#536471]">
            Describe what kind of tweets you care about and how the replies
            should be
          </p>
          <Textarea
            value={filteringPrompt}
            onChange={(e) => setFilteringPrompt(e.target.value)}
            placeholder="e.g. I want tweets that expose crypto scams, rug pulls, or warn about suspicious new token launches. Ignore promotional tweets, shill posts, and anything that's just hype without substance."
            rows={6}
            className="mt-3 rounded-[4px] border-[#cfd9de] bg-white text-[15px] leading-[20px] text-[#0f1419] placeholder:text-[#536471]/60 focus-visible:border-[#1d9bf0] focus-visible:ring-1 focus-visible:ring-[#1d9bf0]/30"
          />
          {promptChanged && (
            <div className="mt-2 flex justify-end">
              <Button
                onClick={handleSavePrompt}
                disabled={savingPrompt}
                className="h-8 rounded-full bg-[#1d9bf0] px-4 text-[13px] font-bold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
              >
                {savingPrompt ? "Saving..." : "Save prompt"}
              </Button>
            </div>
          )}
        </div>

        {/* Right — Keywords */}
        <div className="md:pl-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[#0f1419]">Keywords</h2>
              <p className="mt-0.5 text-[13px] text-[#536471]">
                All active keywords are combined into one Twitter search
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingKeyword(null);
                setFormOpen(true);
              }}
              className="h-8 rounded-full bg-[#1d9bf0] px-3 text-[13px] font-bold text-white hover:bg-[#1a8cd8]"
            >
              <svg viewBox="0 0 24 24" className="mr-1 h-3.5 w-3.5 fill-white">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Add
            </Button>
          </div>

          <div className="mt-3 border-t border-[#eff3f4]">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1d9bf0] border-t-transparent" />
              </div>
            ) : (
              <KeywordList
                keywords={keywords}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            )}
          </div>
        </div>
      </div>

      <KeywordForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingKeyword(null);
        }}
        keyword={editingKeyword}
        onSave={handleSave}
      />
    </div>
  );
}
