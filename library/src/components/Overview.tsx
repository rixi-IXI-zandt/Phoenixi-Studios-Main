import React from 'react';
import {
  Users,
  Building2,
  Globe,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  GitMerge,
  ArrowRight,
} from 'lucide-react';
import { Entity, Story, Note, ExtractedFact, CanonConflict, Project, EntityType } from '../types';
import { PhoenixiLogo, IXIMark } from './PhoenixiBrand';

interface OverviewProps {
  project?: Project | null;
  entities?: Entity[];
  stories?: Story[];
  notes?: Note[];
  extractedFacts?: ExtractedFact[];
  canonConflicts?: CanonConflict[];
  onNavigateView?: (view: any, entityType?: EntityType) => void;
  onSelectEntity?: (id: string) => void;
  onSelectNote?: (id: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  project = null,
  entities = [],
  stories = [],
  notes = [],
  extractedFacts = [],
  canonConflicts = [],
  onNavigateView,
  onSelectEntity,
  onSelectNote,
}) => {
  const characters = entities.filter((e) => e.type === 'character');
  const locations = entities.filter((e) => e.type === 'location');
  const organizations = entities.filter((e) => e.type === 'organization');
  const pendingFacts = extractedFacts.filter((f) => f.status === 'PROPOSED');
  const activeConflicts = canonConflicts.filter((c) => c.status === 'unresolved');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Project Header Banner - Art Deco Stylized */}
      <div className="bg-[#14141D] border border-[#E2B3FF]/30 rounded-xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden artdeco-frame">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6EF0FF] font-artdeco">
              Phoenixi Studios World Core
            </span>
            <IXIMark />
          </div>
          <h1 className="text-3xl font-black text-white font-artdeco tracking-tight text-macaron-gradient">
            {project?.name || 'Phoenixi Library'}
          </h1>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed font-sans">
            {project?.description || 'Creative world-building matrix powered by Phoenixi Studios. Manage characters, locations, plot threads, and source-linked lore review.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <button
            onClick={() => onNavigateView('notes_ingestion')}
            className="px-4 py-2.5 rounded-md bg-[#B8FFD9] text-[#0B0B0D] text-xs font-bold hover:brightness-110 flex items-center gap-2 shadow-lg artdeco-chamfer-sm transition-all"
          >
            <FileText className="w-4 h-4 text-[#0B0B0D]" />
            <span className="font-sans">Notes & Source Review</span>
          </button>
          <button
            onClick={() => onNavigateView('story_database')}
            className="px-4 py-2.5 rounded-md bg-[#181825] border border-[#6EF0FF]/40 text-[#6EF0FF] text-xs font-semibold hover:border-[#6EF0FF] hover:bg-[#1C1C2D] flex items-center gap-2 transition-all artdeco-chamfer-sm"
          >
            <BookOpen className="w-4 h-4 text-[#6EF0FF]" />
            <span>Write Story</span>
          </button>
        </div>
      </div>

      {/* Database Statistics Cards - Pastel Macaron Palette */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="artdeco-card p-4 rounded-lg flex items-center gap-3.5 border border-[#6EF0FF]/30">
          <div className="p-2.5 rounded-md bg-[#6EF0FF]/10 text-[#6EF0FF] border border-[#6EF0FF]/30 artdeco-chamfer-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-artdeco">{entities.length}</div>
            <div className="text-[11px] text-[#6EF0FF] font-medium tracking-wide">Total Entities</div>
          </div>
        </div>

        <div className="artdeco-card p-4 rounded-lg flex items-center gap-3.5 border border-[#B8FFD9]/30">
          <div className="p-2.5 rounded-md bg-[#B8FFD9]/10 text-[#B8FFD9] border border-[#B8FFD9]/30 artdeco-chamfer-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-artdeco">{stories.length}</div>
            <div className="text-[11px] text-[#B8FFD9] font-medium tracking-wide">Stories & Drafts</div>
          </div>
        </div>

        <div className="artdeco-card p-4 rounded-lg flex items-center gap-3.5 border border-[#E2B3FF]/30">
          <div className="p-2.5 rounded-md bg-[#E2B3FF]/10 text-[#E2B3FF] border border-[#E2B3FF]/30 artdeco-chamfer-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-artdeco">{pendingFacts.length}</div>
            <div className="text-[11px] text-[#E2B3FF] font-medium tracking-wide">Pending Review</div>
          </div>
        </div>

        <div className="artdeco-card p-4 rounded-lg flex items-center gap-3.5 border border-[#9B6BFF]/30">
          <div className="p-2.5 rounded-md bg-[#9B6BFF]/10 text-[#9B6BFF] border border-[#9B6BFF]/30 artdeco-chamfer-sm">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-artdeco">{activeConflicts.length}</div>
            <div className="text-[11px] text-[#9B6BFF] font-medium tracking-wide">Canon Conflicts</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Entities & Extraction Queue status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Entities Column */}
        <div className="lg:col-span-2 artdeco-card rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2B3FF]/20 pb-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 font-artdeco tracking-wider">
              <Users className="w-4 h-4 text-[#6EF0FF]" />
              Recent World Database Entities
            </h3>
            <button
              onClick={() => onNavigateView('entity_list', 'character')}
              className="text-xs font-semibold text-[#B8FFD9] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {(entities || []).length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No entities in world database yet. Create characters, locations, or paste narrative notes to run source-linked lore review.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(entities || []).slice(0, 6).map((e) => (
                <button
                  key={e.id}
                  onClick={() => onSelectEntity(e.id)}
                  className="text-left p-3.5 rounded-md bg-[#0B0B0D] hover:bg-[#181825] border border-[#E2B3FF]/20 hover:border-[#6EF0FF]/60 transition-all artdeco-chamfer-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-slate-100 text-sm font-sans">{e.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#181822] text-[#6EF0FF] px-1.5 py-0.5 rounded border border-[#6EF0FF]/30">
                        {e.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {e.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="mt-2.5 text-[10px] text-[#E2B3FF]/70 font-medium flex items-center justify-between">
                    <span>{e.relationships.length} relationships</span>
                    <span className="text-[#B8FFD9]">Canon: {e.canonState}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Extraction Pipeline Queue & Canon Status */}
        <div className="artdeco-card rounded-xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-200 text-sm border-b border-[#E2B3FF]/20 pb-3 flex items-center gap-2 font-artdeco tracking-wider">
              <Sparkles className="w-4 h-4 text-[#E2B3FF]" />
              Extraction & Canon Safety
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-md bg-[#0B0B0D] border border-[#E2B3FF]/30 artdeco-chamfer-sm">
                <div className="font-semibold text-[#E2B3FF] mb-1">Pending Extraction Facts</div>
                <div className="text-slate-400">
                  {pendingFacts.length} fact proposals extracted from source notes waiting for review.
                </div>
                <button
                  onClick={() => onNavigateView('extraction_queue')}
                  className="mt-2.5 text-xs font-bold text-[#6EF0FF] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Review Proposals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 rounded-md bg-[#0B0B0D] border border-[#9B6BFF]/30 artdeco-chamfer-sm">
                <div className="font-semibold text-[#9B6BFF] mb-1">Canon Conflict Monitor</div>
                <div className="text-slate-400">
                  {activeConflicts.length === 0
                    ? 'No unresolved conflicts recorded. This is not an automatic audit of your sources.'
                    : `${activeConflicts.length} active canon conflicts detected between source references.`}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-md bg-[#B8FFD9]/10 border border-[#B8FFD9]/30 text-slate-300 text-[11px] artdeco-chamfer-sm">
            <span className="font-bold text-[#B8FFD9]">Provenance Rule:</span> Source-linked proposals preserve their quoted evidence. Manually authored records are identified separately.
          </div>
        </div>
      </div>
    </div>
  );
};

