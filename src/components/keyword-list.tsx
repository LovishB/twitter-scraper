"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Keyword } from "@/lib/types";

interface KeywordListProps {
  keywords: Keyword[];
  onEdit: (keyword: Keyword) => void;
  onDelete: (id: string) => void;
  onToggleActive: (keyword: Keyword) => void;
}

export function KeywordList({
  keywords,
  onEdit,
  onDelete,
  onToggleActive,
}: KeywordListProps) {
  if (keywords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-3 text-[40px]">
          <svg viewBox="0 0 24 24" className="h-10 w-10 fill-[#cfd9de]">
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
          </svg>
        </div>
        <p className="text-[15px] font-bold text-[#0f1419]">No keywords yet</p>
        <p className="mt-1 text-[13px] text-[#536471]">
          Add keywords to start tracking tweets.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#eff3f4]">
      {keywords.map((kw) => (
        <div
          key={kw.id}
          className="group flex items-start gap-3 px-0 py-3 transition-colors hover:bg-[#f7f9f9]"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#0f1419]">
                {kw.keyword}
              </span>
              <Badge
                variant="secondary"
                className={`h-[20px] rounded-[4px] px-1.5 text-[11px] font-semibold ${
                  kw.is_active
                    ? "bg-[#1d9bf0]/10 text-[#1d9bf0]"
                    : "bg-[#f7f9f9] text-[#536471]"
                }`}
              >
                {kw.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onToggleActive(kw)}
              className="h-8 w-8 rounded-full text-[#536471] hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]"
              title={kw.is_active ? "Deactivate" : "Activate"}
            >
              {kw.is_active ? (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                  <path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352C1.218 11.271 4.818 3.5 12 3.5c2.442 0 4.47.801 6.104 1.982l2.189-2.189 1.414 1.414L3.693 21.707zM12 5.5c-5.609 0-8.658 5.291-9.33 6.5.468.885 1.28 2.186 2.478 3.394l2.186-2.186C7.122 12.52 7 11.778 7 11c0-2.757 2.243-5 5-5 .778 0 1.52.122 2.208.346L16.394 4.16C14.89 5.011 13.533 5.5 12 5.5zm10.266 5.852l-.131.352c-.05.137-.477 1.249-1.397 2.624l-1.1-1.1c.56-.875.917-1.58 1.032-1.828-.67-1.209-3.719-6.4-9.34-6.4l-.57.023 1.47-1.47C11.523 3.508 11.8 3.5 12 3.5c7.182 0 10.782 7.771 10.95 8.147l.131.352-.131.353zm-5.478-.804l-4.58 4.58C10.77 14.867 9.5 13.598 9.5 12c0-1.654 1.346-3 3-3 1.598 0 2.867 1.27 3.108 2.708l-.82-.16z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(kw)}
              className="h-8 w-8 rounded-full text-[#536471] hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]"
              title="Edit"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(kw.id)}
              className="h-8 w-8 rounded-full text-[#536471] hover:bg-[#f4212e]/10 hover:text-[#f4212e]"
              title="Delete"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
              </svg>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
