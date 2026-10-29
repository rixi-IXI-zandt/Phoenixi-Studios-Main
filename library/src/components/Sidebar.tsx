import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Globe,
  Sparkles,
  Dna,
  Cpu,
  Package,
  Home,
  Crown,
  Share2,
  BookOpen,
  GitMerge,
  Calendar,
  MapPin,
  FileText,
  ImageIcon,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { EntityType } from '../types';
import { IXIMark } from './PhoenixiBrand';

export type NavView =
  | 'overview'
  | 'entity_list'
  | 'template_manager'
  | 'relationship_graph'
  | 'story_database'
  | 'plot_threads'
  | 'timeline'
  | 'map_system'
  | 'notes_ingestion'
  | 'extraction_queue'
  | 'asset_library';

interface SidebarProps {
  currentView?: NavView | string;
  selectedEntityType?: EntityType | null;
  onNavigateView?: (view: NavView | string, entityType?: EntityType) => void;
  pendingExtractionCount?: number;
  unresolvedConflictCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedEntityType,
  onNavigateView,
  pendingExtractionCount = 0,
  unresolvedConflictCount = 0,
}) => {
  const entityCategories: { type: EntityType; label: string; icon: React.ReactNode }[] = [
    { type: 'character', label: 'Characters', icon: <Users className="w-4 h-4 text-[#6EF0FF]" /> },
    { type: 'organization', label: 'Organizations', icon: <Building2 className="w-4 h-4 text-[#B8FFD9]" /> },
    { type: 'location', label: 'Locations', icon: <Globe className="w-4 h-4 text-[#E2B3FF]" /> },
    { type: 'culture', label: 'Cultures & Lenses', icon: <Sparkles className="w-4 h-4 text-[#9B6BFF]" /> },
    { type: 'species', label: 'Species', icon: <Dna className="w-4 h-4 text-[#6EF0FF]" /> },
    { type: 'discovery', label: 'Discoveries / Magic', icon: <Cpu className="w-4 h-4 text-[#B8FFD9]" /> },
    { type: 'item', label: 'Items & Artifacts', icon: <Package className="w-4 h-4 text-[#E2B3FF]" /> },
    { type: 'structure', label: 'Structures', icon: <Home className="w-4 h-4 text-[#9B6BFF]" /> },
    { type: 'room', label: 'Rooms', icon: <Home className="w-4 h-4" /> },
    { type: 'event', label: 'Event Records', icon: <Calendar className="w-4 h-4" /> },
    { type: 'pantheon', label: 'Pantheons & Deities', icon: <Crown className="w-4 h-4 text-[#6EF0FF]" /> },
  ];

  return (
    <aside className="w-64 bg-[#0B0B0D] border-r border-[#E2B3FF]/20 flex flex-col justify-between overflow-y-auto text-slate-300 select-none text-xs">
      <div className="p-3 space-y-5">
        {/* Project Overview */}
        <div>
          <button
            onClick={() => onNavigateView('overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-semibold transition-all artdeco-chamfer-sm ${
              currentView === 'overview'
                ? 'bg-[#181825] text-white border border-[#6EF0FF]/60 shadow-[0_0_12px_rgba(110,240,255,0.2)]'
                : 'hover:bg-[#14141D] text-slate-300 border border-transparent hover:border-[#E2B3FF]/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-[#6EF0FF]" />
              <span className="font-artdeco tracking-wider">Project Overview</span>
            </div>
            <IXIMark />
          </button>
        </div>

        {/* World Entities */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.2em] text-[#E2B3FF]/80 uppercase font-artdeco">
            World Entities
          </div>
          <div className="space-y-0.5">
            {(entityCategories || []).map((cat) => {
              const isActive = currentView === 'entities' && selectedEntityType === cat.type;
              return (
                <button
                  key={cat.type}
                  onClick={() => onNavigateView('entity_list', cat.type)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                    isActive
                      ? 'bg-[#181822] text-white font-semibold border border-[#E2B3FF]/50 shadow-[0_0_10px_rgba(226,179,255,0.15)]'
                      : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#E2B3FF]/20'
                  }`}
                >
                  {cat.icon}
                  <span className="font-sans">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Narrative & Stories */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.2em] text-[#B8FFD9]/80 uppercase font-artdeco">
            Story Environment
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigateView('story_database')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'stories'
                  ? 'bg-[#181822] text-white font-semibold border border-[#B8FFD9]/50 shadow-[0_0_10px_rgba(184,255,217,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#B8FFD9]/20'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#B8FFD9]" />
              <span>Stories, Chapters & Editor</span>
            </button>

            <button
              onClick={() => onNavigateView('plot_threads')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'threads'
                  ? 'bg-[#181822] text-white font-semibold border border-[#E2B3FF]/50 shadow-[0_0_10px_rgba(226,179,255,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#E2B3FF]/20'
              }`}
            >
              <GitMerge className="w-4 h-4 text-[#E2B3FF]" />
              <span>Plot & Unresolved Threads</span>
            </button>

            <button
              onClick={() => onNavigateView('timeline')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'timeline'
                  ? 'bg-[#181822] text-white font-semibold border border-[#6EF0FF]/50 shadow-[0_0_10px_rgba(110,240,255,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#6EF0FF]/20'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#6EF0FF]" />
              <span>Timeline & Events</span>
            </button>

            <button
              onClick={() => onNavigateView('map_system')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'maps'
                  ? 'bg-[#181822] text-white font-semibold border border-[#9B6BFF]/50 shadow-[0_0_10px_rgba(155,107,255,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#9B6BFF]/20'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#9B6BFF]" />
              <span>Interactive World Maps</span>
            </button>
          </div>
        </div>

        {/* Visual Graph & Structure */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.2em] text-[#9B6BFF]/80 uppercase font-artdeco">
            Graph & Templates
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigateView('relationship_graph')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'graph'
                  ? 'bg-[#181822] text-white font-semibold border border-[#6EF0FF]/50 shadow-[0_0_10px_rgba(110,240,255,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#6EF0FF]/20'
              }`}
            >
              <Share2 className="w-4 h-4 text-[#6EF0FF]" />
              <span>Relationship Graph</span>
            </button>

            <button
              onClick={() => onNavigateView('template_manager')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'templates'
                  ? 'bg-[#181822] text-white font-semibold border border-[#E2B3FF]/50 shadow-[0_0_10px_rgba(226,179,255,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#E2B3FF]/20'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#E2B3FF]" />
              <span>Custom Entity Templates</span>
            </button>
          </div>
        </div>

        {/* Ingestion & AI Lore Extraction */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.2em] text-[#6EF0FF]/80 uppercase font-artdeco">
            Ingestion & Lore Engine
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigateView('notes_ingestion')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'notes'
                  ? 'bg-[#181822] text-white font-semibold border border-[#B8FFD9]/50 shadow-[0_0_10px_rgba(184,255,217,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#B8FFD9]/20'
              }`}
            >
              <FileText className="w-4 h-4 text-[#B8FFD9]" />
              <span>Notes & Narrative Ingestion</span>
            </button>

            <button
              onClick={() => onNavigateView('extraction_queue')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'extraction_queue'
                  ? 'bg-[#181822] text-white font-semibold border border-[#6EF0FF]/50 shadow-[0_0_10px_rgba(110,240,255,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#6EF0FF]/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#6EF0FF]" />
                <span>Extraction Review & Conflicts</span>
              </div>
              {pendingExtractionCount > 0 && (
                <span className="bg-[#6EF0FF]/20 text-[#6EF0FF] border border-[#6EF0FF]/40 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingExtractionCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigateView('asset_library')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                currentView === 'assets'
                  ? 'bg-[#181822] text-white font-semibold border border-[#9B6BFF]/50 shadow-[0_0_10px_rgba(155,107,255,0.15)]'
                  : 'hover:bg-[#14141D] text-slate-400 hover:text-slate-100 border border-transparent hover:border-[#9B6BFF]/20'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#9B6BFF]" />
              <span>Asset Library</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-[#E2B3FF]/20 text-[10px] text-slate-500 text-center font-artdeco tracking-wider">
        Phoenixi Studios • One Core. Infinite Worlds.
      </div>
    </aside>
  );
};

