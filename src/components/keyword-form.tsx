"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Keyword } from "@/lib/types";

interface KeywordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyword?: Keyword | null;
  onSave: (data: { keyword: string; is_active?: boolean }) => void;
}

export function KeywordForm({
  open,
  onOpenChange,
  keyword,
  onSave,
}: KeywordFormProps) {
  const [keywordText, setKeywordText] = useState("");
  const isEditing = !!keyword;

  useEffect(() => {
    if (keyword) {
      setKeywordText(keyword.keyword);
    } else {
      setKeywordText("");
    }
  }, [keyword, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ keyword: keywordText.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] border-[#eff3f4] bg-white p-0 shadow-xl">
        <DialogHeader className="border-b border-[#eff3f4] px-4 py-3">
          <DialogTitle className="text-[15px] font-bold text-[#0f1419]">
            {isEditing ? "Edit keyword" : "Add keyword"}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#536471]">
            {isEditing
              ? "Update your search keyword."
              : "Add a new keyword to track on Twitter."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="keyword"
              className="text-[13px] font-medium text-[#536471]"
            >
              Keyword or phrase
            </label>
            <Input
              id="keyword"
              value={keywordText}
              onChange={(e) => setKeywordText(e.target.value)}
              placeholder='e.g. "rug pull", memecoin scam'
              className="h-[42px] rounded-[4px] border-[#cfd9de] bg-white text-[15px] text-[#0f1419] placeholder:text-[#536471]/60 focus-visible:border-[#1d9bf0] focus-visible:ring-1 focus-visible:ring-[#1d9bf0]/30"
              required
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!keywordText.trim()}
            className="h-9 rounded-full bg-[#1d9bf0] text-[14px] font-bold text-white hover:bg-[#1a8cd8] disabled:opacity-50"
          >
            {isEditing ? "Save" : "Add keyword"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
