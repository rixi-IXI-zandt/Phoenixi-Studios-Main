import React from 'react';
import {
  X,
  Bookmark,
  History,
  Trash2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Users,
  FileText,
} from 'lucide-react';
import { Bookmark as BookmarkType, NavigationHistoryItem } from '../types';
import { IXIMark } from './PhoenixiBrand';

interface ContextualSidebarProps {
  isOpen: boolean;
  activeTab: 'bookmarks' | 'history';
  onClose: () => void;
  bookmarks: BookmarkType[];
  history: NavigationHistoryItem[];
  onSelectBookmark: (b: BookmarkType) => void;
  onSelectHistory: (h: NavigationHistoryItem) => void;
  onRemoveBookmark: (targetId: string) => void;
}

export const ContextualSidebar: React.FC<ContextualSidebarProps> = ({
  isOpen,
  activeTab,
  onClose,
  bookmarks = [],
  history = [],
  onSelectBookmark,
  onSelectHistory,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <aside aria-label="Bookmarks" className="w-72 bg-[#14141D] border-l border-[#E2B3FF]/30 text-slate-200 flex flex-col h-[calc(100vh-4rem)] fixed right-0 top-16 z-50 select-none text-xs artdeco-frame">
      {/* Header */}
      <div className="p-3 border-b border-[#E2B3FF]/20 flex items-center justify-between bg-[#0B0B0D]/80">
        <div className="flex items-center gap-2 font-bold text-slate-200 font-artdeco">
          <IXIMark className="scale-75" />
          {activeTab === 'bookmarks' ? (
            <>
              <Bookmark className="w-4 h-4 text-[#B8FFD9]" />
              <span className="text-[#B8FFD9]">Pinned Bookmarks</span>
            </>
          ) : (
            <>
              <History className="w-4 h-4 text-[#9B6BFF]" />
              <span className="text-[#9B6BFF]">Navigation History</span>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1C1C2A] transition-colors artdeco-chamfer-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 overflow-y-auto space-y-2 flex-1">
        {activeTab === 'bookmarks' ? (
          (bookmarks || []).length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No pinned bookmarks yet. Open an entity and choose Pin Bookmark.
            </div>
          ) : (
            (bookmarks || []).map((b) => (
              <div
                key={b.id}
                className="group flex items-center justify-between p-2.5 rounded-lg bg-[#0B0B0D]/60 hover:bg-[#0B0B0D] border border-[#B8FFD9]/30 transition-colors artdeco-chamfer-sm"
              >
                <button
                  onClick={() => onSelectBookmark(b)}
                  className="flex-1 text-left flex items-center gap-2"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#B8FFD9] shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-[#B8FFD9] line-clamp-1">
                      {b.title}
                    </div>
                    {b.subtitle && (
                      <div className="text-[10px] text-slate-400 capitalize">{b.subtitle}</div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => onRemoveBookmark(b.targetId)}
                  className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )
        ) : (history || []).length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No history recorded yet. As you navigate entities and stories, your recent view history will appear here.
          </div>
        ) : (
          (history || []).map((h, i) => (
            <button
              key={`${h.targetId}-${h.timestamp}-${i}`}
              onClick={() => onSelectHistory(h)}
              className="w-full text-left p-2.5 rounded-lg bg-[#0B0B0D]/60 hover:bg-[#0B0B0D] border border-[#9B6BFF]/30 flex items-center justify-between group transition-colors artdeco-chamfer-sm"
            >
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-[#9B6BFF] shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-[#9B6BFF] line-clamp-1">
                    {h.title}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">{h.type}</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </button>
          ))
        )}
      </div>
    </aside>
  );
};
