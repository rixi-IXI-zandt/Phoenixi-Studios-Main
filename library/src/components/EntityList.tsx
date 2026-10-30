import React, { useState } from 'react';
import { Plus, Search, Filter, Tag, Users, Building2, Globe, Sparkles, Dna, Cpu, Package, Home, Crown } from 'lucide-react';
import { Entity, EntityType } from '../types';
import { IXIMark } from './PhoenixiBrand';

interface EntityListProps {
  entityType: EntityType;
  entities: Entity[];
  onSelectEntity: (id: string) => void;
  onCreateEntity: (type: EntityType) => void;
}

export const EntityList: React.FC<EntityListProps> = ({
  entityType,
  entities,
  onSelectEntity,
  onCreateEntity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const safeEntities = entities || [];

  const filteredEntities = safeEntities.filter((e) => {
    if (e.type !== entityType) return false;
    const aliases = e.aliases || [];
    const tags = e.tags || [];
    const matchesSearch =
      (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      aliases.some((a) => (a || '').toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag = selectedTag ? tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Extract all unique tags
  const allTags = Array.from(
    new Set(safeEntities.filter((e) => e.type === entityType).flatMap((e) => e.tags || []))
  );

  const getTypeTitle = (type: EntityType) => {
    switch (type) {
      case 'character': return 'Characters';
      case 'organization': return 'Organizations';
      case 'location': return 'Locations';
      case 'culture': return 'Cultures & Cultural Lenses';
      case 'species': return 'Species';
      case 'discovery': return 'Discoveries & Magic';
      case 'item': return 'Items & Artifacts';
      case 'structure': return 'Structures & Rooms';
      case 'pantheon': return 'Pantheons & Deities';
      default: return 'Entities';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-ixi-paper">
      {/* Top Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ixi-surface p-5 rounded-xl border border-[#E2B3FF]/30 shadow-xl artdeco-frame">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <IXIMark />
            <h2 className="text-xl font-black text-white font-artdeco tracking-tight flex items-center gap-2">
              <span>{getTypeTitle(entityType)}</span>
              <span className="text-xs font-semibold bg-ixi-ink text-[#6EF0FF] px-2.5 py-1 rounded-md border border-[#6EF0FF]/30">
                {filteredEntities.length}
              </span>
            </h2>
          </div>
          <p className="text-xs text-ixi-paper">
            Structured world database records for {getTypeTitle(entityType).toLowerCase()}.
          </p>
        </div>

        <button
          onClick={() => onCreateEntity(entityType)}
          className="px-4 py-2.5 rounded-md bg-[#6EF0FF] text-[#0B0B0D] text-xs font-bold hover:brightness-110 flex items-center gap-2 shadow-lg artdeco-chamfer-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-[#0B0B0D]" />
          <span>Create New {entityType.toUpperCase()}</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6EF0FF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${getTypeTitle(entityType).toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="library-search w-full bg-ixi-ink border border-[#E2B3FF]/30 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#6EF0FF]"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            <Tag className="w-3.5 h-3.5 text-[#B8FFD9] shrink-0" />
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all artdeco-chamfer-sm ${
                selectedTag === null
                  ? 'bg-[#B8FFD9] text-[#0B0B0D]'
                  : 'bg-ixi-ink border border-[#E2B3FF]/30 text-ixi-paper hover:text-white'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all artdeco-chamfer-sm ${
                  selectedTag === tag
                    ? 'bg-[#B8FFD9] text-[#0B0B0D]'
                    : 'bg-ixi-ink border border-[#E2B3FF]/30 text-ixi-paper hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entity Grid */}
      {filteredEntities.length === 0 ? (
        <div className="text-center py-16 artdeco-card rounded-xl">
          <p className="text-ixi-muted text-xs mb-3">
            No {getTypeTitle(entityType).toLowerCase()} found in world database.
          </p>
          <button
            onClick={() => onCreateEntity(entityType)}
            className="px-4 py-2 rounded-md bg-ixi-ink text-[#6EF0FF] border border-[#6EF0FF]/40 text-xs font-bold hover:border-[#6EF0FF] artdeco-chamfer-sm"
          >
            Create First {entityType.toUpperCase()}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntities.map((entity) => (
            <div
              key={entity.id}
              onClick={() => onSelectEntity(entity.id)}
              className="artdeco-card rounded-xl p-4 shadow-lg hover:border-[#6EF0FF]/60 transition-all cursor-pointer flex flex-col justify-between group artdeco-chamfer-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-ixi-paper group-hover:text-[#6EF0FF] text-base transition-colors font-sans">
                    {entity.name}
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-ixi-ink text-[#B8FFD9] px-2 py-0.5 rounded border border-[#B8FFD9]/30 shrink-0">
                    {entity.canonState}
                  </span>
                </div>

                {(entity.aliases || []).length > 0 && (
                  <div className="text-[11px] text-[#E2B3FF]/70 italic mb-2">
                    Aliases: {(entity.aliases || []).join(', ')}
                  </div>
                )}

                <p className="text-xs text-ixi-paper line-clamp-3 mb-3">
                  {entity.description || 'No description recorded.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2B3FF]/20 flex items-center justify-between text-[11px] text-ixi-muted">
                <span>{(entity.relationships || []).length} relationships</span>
                {(entity.tags || []).length > 0 && (
                  <div className="flex gap-1">
                    {(entity.tags || []).slice(0, 2).map((t) => (
                      <span key={t} className="bg-ixi-ink text-[#6EF0FF] border border-[#6EF0FF]/30 px-1.5 py-0.5 rounded text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

