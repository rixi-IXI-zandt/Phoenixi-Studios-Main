import React, { useState, useMemo } from 'react';
import { Search, X, Tag, FileText, Users, Globe, BookOpen, Layers } from 'lucide-react';
import { Entity, Story, Note, ExtractedFact } from '../types';
import { IXIMark } from './PhoenixiBrand';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: Entity[];
  stories: Story[];
  notes: Note[];
  extractedFacts?: ExtractedFact[];
  onSelectEntity: (id: string) => void;
  onSelectStory?: (id: string) => void;
  onSelectNote?: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  entities = [],
  stories = [],
  notes = [],
  extractedFacts = [],
  onSelectEntity,
  onSelectStory,
  onSelectNote,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { entities: [], stories: [], notes: [] };

    const terms = query.toLowerCase().trim().split(/\s+/);
    const tagTerms = terms.filter((t) => t.startsWith('#')).map((t) => t.slice(1));
    const textTerms = terms.filter((t) => !t.startsWith('#'));

    // Helper for matching text
    const matchesText = (text: string) =>
      textTerms.every((term) => text.toLowerCase().includes(term));

    // Helper for matching tags (AND logic for all tags specified)
    const matchesTags = (tags: string[] = []) =>
      tagTerms.every((tag) => (tags || []).some((t) => (t || '').toLowerCase().includes(tag)));

    const matchedEntities = (entities || []).filter((e) => {
      const nameMatch = matchesText(e.name || '');
      const descMatch = matchesText(e.description || '');
      const aliasMatch = (e.aliases || []).some((a) => matchesText(a || ''));
      const tagMatch = tagTerms.length === 0 || matchesTags(e.tags || []);
      return (nameMatch || descMatch || aliasMatch) && tagMatch;
    });

    const matchedStories = (stories || []).filter((s) => {
      const titleMatch = matchesText(s.title || '');
      const descMatch = matchesText(s.description || '');
      const tagMatch = tagTerms.length === 0 || matchesTags(s.tags || []);
      return (titleMatch || descMatch) && tagMatch;
    });

    const matchedNotes = (notes || []).filter((n) => {
      const titleMatch = matchesText(n.title || '');
      const contentMatch = matchesText(n.content || '');
      const tagMatch = tagTerms.length === 0 || matchesTags(n.tags || []);
      return (titleMatch || contentMatch) && tagMatch;
    });

    return {
      entities: matchedEntities.slice(0, 10),
      stories: matchedStories.slice(0, 10),
      notes: matchedNotes.slice(0, 10),
    };
  }, [query, entities, stories, notes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0B0B0D]/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-[#14141D] border border-[#E2B3FF]/30 rounded-xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] artdeco-frame">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E2B3FF]/20 flex items-center gap-3 bg-[#14141D]/90">
          <IXIMark className="scale-75" />
          <Search className="w-5 h-5 text-[#6EF0FF] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search entities, stories, notes or tags (#Faction #Military)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-md bg-[#0B0B0D] border border-[#E2B3FF]/30 text-[#E2B3FF] hover:text-white text-xs font-mono artdeco-chamfer-sm"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-[#E2B3FF]/10">
          {!query.trim() ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Type keywords or tag filters like <span className="text-[#6EF0FF]">#Faction #Military</span> to search across the entire project database.
            </div>
          ) : (
            <>
              {/* Entities */}
              {searchResults.entities.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold tracking-wider text-[#6EF0FF] uppercase mb-2 flex items-center gap-1.5 font-artdeco">
                    <Users className="w-3.5 h-3.5 text-[#6EF0FF]" />
                    World Entities ({searchResults.entities.length})
                  </h4>
                  <div className="space-y-1">
                    {searchResults.entities.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => {
                          onSelectEntity(e.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-lg bg-[#0B0B0D]/60 hover:bg-[#0B0B0D] border border-[#E2B3FF]/20 flex items-center justify-between group transition-colors artdeco-chamfer-sm"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-200 group-hover:text-[#6EF0FF] flex items-center gap-2">
                            <span>{e.name}</span>
                            <span className="text-[10px] uppercase font-bold text-[#E2B3FF] bg-[#14141D] px-1.5 py-0.5 rounded border border-[#E2B3FF]/30">
                              {e.type}
                            </span>
                          </div>
                          {e.description && (
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {e.description}
                            </p>
                          )}
                        </div>
                        {(e.tags || []).length > 0 && (
                          <div className="flex gap-1">
                            {(e.tags || []).slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] bg-[#14141D] text-[#B8FFD9] px-1.5 py-0.5 rounded border border-[#B8FFD9]/30"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories */}
              {searchResults.stories.length > 0 && (
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold tracking-wider text-[#B8FFD9] uppercase mb-2 flex items-center gap-1.5 font-artdeco">
                    <BookOpen className="w-3.5 h-3.5 text-[#B8FFD9]" />
                    Stories & Chapters ({searchResults.stories.length})
                  </h4>
                  <div className="space-y-1">
                    {searchResults.stories.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSelectStory?.(s.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-lg bg-[#0B0B0D]/60 hover:bg-[#0B0B0D] border border-[#B8FFD9]/20 flex items-center justify-between group transition-colors artdeco-chamfer-sm"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-200 group-hover:text-[#B8FFD9]">
                            {s.title}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {s.description || 'No description'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {searchResults.notes.length > 0 && (
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold tracking-wider text-[#E2B3FF] uppercase mb-2 flex items-center gap-1.5 font-artdeco">
                    <FileText className="w-3.5 h-3.5 text-[#E2B3FF]" />
                    Notes & Narrative Ingestion ({searchResults.notes.length})
                  </h4>
                  <div className="space-y-1">
                    {searchResults.notes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          onSelectNote?.(n.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-lg bg-[#0B0B0D]/60 hover:bg-[#0B0B0D] border border-[#E2B3FF]/20 flex items-center justify-between group transition-colors artdeco-chamfer-sm"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-200 group-hover:text-[#E2B3FF]">
                            {n.title}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {n.content.slice(0, 100)}...
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.entities.length === 0 &&
                searchResults.stories.length === 0 &&
                searchResults.notes.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No matching entities, stories, or notes found for "{query}".
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
