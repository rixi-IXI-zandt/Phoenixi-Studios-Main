import React, { useState } from 'react';
import {TemplateInput} from './TemplateInput';
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  Share2,
  Tag,
  Bookmark,
  ExternalLink,
  Sparkles,
  Link,
  ShieldCheck,
  Check,
  Building2,
  Globe,
  Dna,
  Cpu,
  Package,
  Home,
  Crown,
} from 'lucide-react';
import { Entity, EntityType, CustomTemplate, EntityRelationship, CulturalLens, ProvenanceReference } from '../types';

interface EntityDetailProps {
  entity: Entity;
  allEntities: Entity[];
  templates: CustomTemplate[];
  onSaveEntity: (e: Entity) => boolean;
  onDirtyChange: (dirty: boolean) => void;
  onDeleteEntity: (id: string) => void;
  onBack: () => void;
  onSelectRelatedEntity: (id: string) => void;
  onNavigateToSource: (ref: ProvenanceReference) => void;
  onToggleBookmark: (e: Entity) => void;
  isBookmarked: boolean;
}

export const EntityDetail: React.FC<EntityDetailProps> = ({
  entity,
  allEntities,
  templates,
  onSaveEntity,
  onDirtyChange,
  onDeleteEntity,
  onBack,
  onSelectRelatedEntity,
  onNavigateToSource,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [formData, setFormData] = useState<Entity>({
    ...entity,
    aliases: entity.aliases || [],
    tags: entity.tags || [],
    relationships: entity.relationships || [],
    sourceReferences: entity.sourceReferences || [],
    culturalLenses: entity.culturalLenses || [],
    customFields: entity.customFields || {},
  });

  React.useEffect(() => {
    setFormData({
      ...entity,
      aliases: entity.aliases || [],
      tags: entity.tags || [],
      relationships: entity.relationships || [],
      sourceReferences: entity.sourceReferences || [],
      culturalLenses: entity.culturalLenses || [],
      customFields: entity.customFields || {},
    });
  }, [entity.id, entity.updatedAt]);

  const [newAlias, setNewAlias] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showAddRelModal, setShowAddRelModal] = useState(false);

  // New Relationship Form
  const [targetEntityId, setTargetEntityId] = useState('');
  const [relType, setRelType] = useState('Associated with');
  const [relDesc, setRelDesc] = useState('');
  const [relDir, setRelDir] = useState<'directed' | 'bi-directional'>('directed');

  // Cultural Lens Form (for Culture entity type)
  const [targetCultureId, setTargetCultureId] = useState('');
  const [lensText, setLensText] = useState('');

  const matchingTemplate = (templates || []).find((t) => t.entityType === formData.type);

  const handleFieldChange = (field: keyof Entity, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      customFields: { ...prev.customFields, [fieldId]: value },
    }));
  };

  const handleAddAlias = () => {
    if (!newAlias.trim()) return;
    const currentAliases = formData.aliases || [];
    if (!currentAliases.includes(newAlias.trim())) {
      setFormData((prev) => ({ ...prev, aliases: [...(prev.aliases || []), newAlias.trim()] }));
    }
    setNewAlias('');
  };

  const handleRemoveAlias = (alias: string) => {
    setFormData((prev) => ({
      ...prev,
      aliases: (prev.aliases || []).filter((a) => a !== alias),
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...(prev.tags || []), newTag.trim()] }));
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: (prev.tags || []).filter((t) => t !== tag) }));
  };

  const handleAddRelationship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEntityId) return;

    const targetEnt = allEntities.find((ent) => ent.id === targetEntityId);

    const newRel: EntityRelationship = {
      id: `rel-${Date.now()}`,
      sourceId: formData.id,
      sourceName: formData.name,
      targetId: targetEntityId,
      targetName: targetEnt?.name || 'Unknown',
      relationshipType: relType,
      description: relDesc,
      direction: relDir,
      sourceReferences: [],
    };

    setFormData((prev) => ({
      ...prev,
      relationships: [...prev.relationships, newRel],
    }));

    setShowAddRelModal(false);
    setTargetEntityId('');
    setRelType('Associated with');
    setRelDesc('');
  };

  const handleRemoveRelationship = (relId: string) => {
    setFormData((prev) => ({
      ...prev,
      relationships: prev.relationships.filter((r) => r.id !== relId),
    }));
  };

  const handleAddCulturalLens = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCultureId || !lensText.trim()) return;
    const targetEnt = allEntities.find((e) => e.id === targetCultureId);
    const newLens: CulturalLens = {
      id: `lens-${Date.now()}`,
      targetEntityId: targetCultureId,
      targetEntityName: targetEnt?.name || 'Unknown Culture',
      perspectiveText: lensText.trim(),
      sourceReferences: [],
    };

    setFormData((prev) => ({
      ...prev,
      culturalLenses: [...(prev.culturalLenses || []), newLens],
    }));

    setTargetCultureId('');
    setLensText('');
  };

  React.useEffect(()=>{onDirtyChange(JSON.stringify(formData)!==JSON.stringify({...entity, aliases:entity.aliases||[],tags:entity.tags||[],relationships:entity.relationships||[],sourceReferences:entity.sourceReferences||[],culturalLenses:entity.culturalLenses||[],customFields:entity.customFields||{}}));},[formData,entity]);
  const [validationError,setValidationError]=useState('');
  const handleSave = () => {
    if(!formData.name.trim()){setValidationError('Give this entity a name.');return;}
    const missing=matchingTemplate?.fields.find(f=>f.required&&(formData.customFields[f.id]===undefined||formData.customFields[f.id]===''||(Array.isArray(formData.customFields[f.id])&&!formData.customFields[f.id].length)));
    if(missing){setValidationError('Complete '+missing.name);return;}
    setValidationError('');onSaveEntity(formData);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-100 pb-20">
      {validationError&&<p role="alert">{validationError}</p>}
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-[#14141D] p-4 rounded-xl border border-[#E2B3FF]/30 shadow-xl artdeco-chamfer-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B0B0D] text-slate-300 hover:text-white border border-slate-700 hover:border-[#6EF0FF] text-xs font-semibold transition-all artdeco-chamfer-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#6EF0FF]" />
          <span>Back to List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(formData)}
            className={`p-2 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all artdeco-chamfer-sm ${
              isBookmarked
                ? 'bg-[#B8FFD9]/20 text-[#B8FFD9] border-[#B8FFD9]/50'
                : 'bg-[#0B0B0D] text-slate-300 border-slate-700 hover:border-[#B8FFD9]'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#B8FFD9]" />
            <span>{isBookmarked ? 'Pinned' : 'Pin Bookmark'}</span>
          </button>

          <button
            onClick={() => onDeleteEntity(formData.id)}
            className="p-2 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold artdeco-chamfer-sm"
            title="Delete Entity"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-[#6EF0FF] to-[#E2B3FF] text-[#0B0B0D] text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-lg artdeco-chamfer-sm transition-all"
          >
            <Save className="w-4 h-4 text-[#0B0B0D]" />
            <span>Save Entity</span>
          </button>
        </div>
      </div>

      {/* Main Info Form */}
      {formData.type==='event'&&<div className="grid gap-3 md:grid-cols-2 p-4"><label>Date / era<input value={formData.dateText||''} onChange={e=>handleFieldChange('dateText',e.target.value)}/></label><label>Timeline sequence<input type="number" value={formData.customStats?.timelineOrder??''} onChange={e=>handleFieldChange('customStats',{...formData.customStats,timelineOrder:e.target.value===''?undefined:Number(e.target.value)})}/></label></div>}
      <div className="artdeco-card rounded-xl p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#E2B3FF] mb-1 font-artdeco tracking-wider uppercase">
              Entity Name *
            </label>
            <input
              aria-label="Entity name"
              type="text"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg px-3 py-2 text-base font-bold text-white focus:outline-none focus:border-[#6EF0FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6EF0FF] mb-1 font-artdeco tracking-wider uppercase">
              Canon State
            </label>
            <select
              value={formData.canonState}
              onChange={(e) => handleFieldChange('canonState', e.target.value)}
              className="w-full bg-[#0B0B0D] border border-[#6EF0FF]/30 rounded-lg px-3 py-2 text-xs font-semibold text-[#6EF0FF] focus:outline-none focus:border-[#6EF0FF]"
            >
              <option value="CANON">CANON (Author approved)</option>
              <option value="PROPOSED">PROPOSED (Unreviewed)</option>
              <option value="UNVERIFIED">UNVERIFIED</option>
              <option value="CONFLICTING">CONFLICTING</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        {/* Aliases */}
        <div>
          <label className="block text-xs font-semibold text-[#E2B3FF] mb-1 uppercase tracking-wider">
            Aliases & Alternate Names
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(formData.aliases || []).map((alias) => (
              <span
                key={alias}
                className="bg-[#0B0B0D] text-slate-200 border border-[#E2B3FF]/30 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 artdeco-chamfer-sm"
              >
                <span>{alias}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAlias(alias)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add alias..."
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAlias())}
              className="flex-1 bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6EF0FF]"
            />
            <button
              type="button"
              onClick={handleAddAlias}
              className="px-3 py-1.5 rounded-md bg-[#181825] border border-[#E2B3FF]/30 text-[#E2B3FF] text-xs font-semibold hover:border-[#E2B3FF]"
            >
              Add
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#E2B3FF] mb-1 uppercase tracking-wider">
            Description & Overview
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-[#6EF0FF]"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-[#B8FFD9] mb-1 uppercase tracking-wider">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(formData.tags || []).map((tag) => (
              <span
                key={tag}
                className="bg-[#B8FFD9]/10 text-[#B8FFD9] border border-[#B8FFD9]/30 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 artdeco-chamfer-sm"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 bg-[#0B0B0D] border border-[#B8FFD9]/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#B8FFD9]"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-1.5 rounded-md bg-[#181825] border border-[#B8FFD9]/30 text-[#B8FFD9] text-xs font-semibold hover:border-[#B8FFD9]"
            >
              Add
            </button>
          </div>
        </div>

        {/* Custom Template Fields */}
        {matchingTemplate && (matchingTemplate.fields || []).length > 0 && (
          <div className="pt-4 border-t border-[#E2B3FF]/20 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6EF0FF] font-artdeco">
              Template Fields ({matchingTemplate.name})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(matchingTemplate.fields || []).map((field) => (
                <div key={field.id} className={field.fieldType === 'longtext' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {field.name}
                  </label>
                  <TemplateInput field={field} value={formData.customFields?.[field.id] ?? field.defaultValue} entities={allEntities} onChange={value=>handleCustomFieldChange(field.id,value)}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Hierarchical Nesting (If Location) */}
        {formData.type === 'location' && (
          <div className="pt-4 border-t border-[#E2B3FF]/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8FFD9] flex items-center gap-1.5 font-artdeco">
              <Globe className="w-4 h-4 text-[#B8FFD9]" />
              Hierarchical Location Nesting
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Parent Enclosing Location
              </label>
              <select
                value={formData.parentLocationId || ''}
                onChange={(e) => handleFieldChange('parentLocationId', e.target.value || undefined)}
                className="w-full max-w-md bg-[#0B0B0D] border border-[#B8FFD9]/30 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#B8FFD9]"
              >
                <option value="">None (Top-Level World Region / Planet)</option>
                {(allEntities || [])
                  .filter((e) => e.type === 'location' && e.id !== formData.id)
                  .map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {/* Culture & Cultural Lens System */}
        {formData.type === 'culture' && (
          <div className="pt-4 border-t border-[#E2B3FF]/20 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9B6BFF] flex items-center gap-1.5 font-artdeco">
              <Sparkles className="w-4 h-4 text-[#9B6BFF]" />
              Cultural Lens Perspectives
            </h4>

            {(formData.culturalLenses || []).length > 0 && (
              <div className="space-y-2">
                {(formData.culturalLenses || []).map((lens) => (
                  <div
                    key={lens.id}
                    className="p-3 rounded-lg bg-[#0B0B0D] border border-[#9B6BFF]/30 flex items-start justify-between"
                  >
                    <div>
                      <span className="font-bold text-[#E2B3FF] text-xs">
                        Perception of {lens.targetEntityName}:
                      </span>
                      <p className="text-xs text-slate-300 mt-1">{lens.perspectiveText}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddCulturalLens} className="space-y-3 bg-[#0B0B0D] p-3.5 rounded-lg border border-[#9B6BFF]/30">
              <div className="text-xs font-semibold text-[#9B6BFF] uppercase tracking-wider">Add Cultural Perspective Lens</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={targetCultureId}
                  onChange={(e) => setTargetCultureId(e.target.value)}
                  className="bg-[#14141D] border border-[#9B6BFF]/30 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="">Select Target Entity / Culture...</option>
                  {(allEntities || [])
                    .filter((e) => e.id !== formData.id)
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.type})
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  placeholder="Documented perspective or bias..."
                  value={lensText}
                  onChange={(e) => setLensText(e.target.value)}
                  className="bg-[#14141D] border border-[#9B6BFF]/30 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-md bg-[#9B6BFF] text-[#0B0B0D] text-xs font-bold hover:brightness-110"
              >
                Add Lens
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Relationships Section */}
      <div className="artdeco-card rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2B3FF]/20 pb-3">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 font-artdeco tracking-wider">
            <Share2 className="w-4 h-4 text-[#6EF0FF]" />
            Entity Relationships ({(formData.relationships || []).length})
          </h3>

          <button
            onClick={() => setShowAddRelModal(true)}
            className="px-3 py-1.5 rounded-md bg-[#0B0B0D] text-[#6EF0FF] border border-[#6EF0FF]/40 text-xs font-bold hover:border-[#6EF0FF] flex items-center gap-1.5 artdeco-chamfer-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Relationship</span>
          </button>
        </div>

        {(formData.relationships || []).length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No explicit database relationships recorded for this entity yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(formData.relationships || []).map((rel) => {
              const targetEnt = (allEntities || []).find((e) => e.id === rel.targetId);
              return (
                <div
                  key={rel.id}
                  className="p-3.5 rounded-md bg-[#0B0B0D] border border-[#E2B3FF]/20 flex items-center justify-between group artdeco-chamfer-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#6EF0FF]">{rel.relationshipType}</span>
                      <span className="text-xs text-slate-400">→</span>
                      <button
                        onClick={() => onSelectRelatedEntity(rel.targetId)}
                        className="text-xs font-bold text-slate-100 hover:text-[#B8FFD9] underline decoration-[#B8FFD9]/50"
                      >
                        {rel.targetName || targetEnt?.name || 'Unknown'}
                      </button>
                    </div>
                    {rel.description && (
                      <p className="text-[11px] text-slate-400 mt-1">{rel.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveRelationship(rel.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Source Provenance References */}
      <div className="artdeco-card rounded-xl p-6 shadow-xl space-y-3">
        <h3 className="font-bold text-slate-200 text-sm border-b border-[#E2B3FF]/20 pb-3 flex items-center gap-2 font-artdeco tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#B8FFD9]" />
          Source Provenance & Canon References ({(formData.sourceReferences || []).length})
        </h3>

        {(formData.sourceReferences || []).length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No source references recorded. Extract lore from Notes to attach verified passage citations.
          </div>
        ) : (
          <div className="space-y-2">
            {(formData.sourceReferences || []).map((ref) => (
              <div
                key={ref.id}
                onClick={() => onNavigateToSource(ref)}
                className="p-3.5 rounded-md bg-[#0B0B0D] hover:bg-[#181825] border border-[#E2B3FF]/20 hover:border-[#B8FFD9]/50 cursor-pointer transition-all flex items-start justify-between artdeco-chamfer-sm"
              >
                <div>
                  <div className="text-xs font-bold text-[#B8FFD9] flex items-center gap-1.5">
                    <span>Source: {ref.sourceTitle}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-300 italic mt-1 font-mono bg-[#14141D] p-2 rounded border border-[#E2B3FF]/20">
                    "{ref.passageSnippet}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Relationship Modal */}
      {showAddRelModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#14141D] border border-[#6EF0FF]/40 rounded-xl p-6 w-full max-w-md text-slate-100 shadow-2xl space-y-4 artdeco-frame">
            <h3 className="text-base font-bold text-[#6EF0FF] flex items-center gap-2 font-artdeco">
              <Share2 className="w-4 h-4 text-[#6EF0FF]" />
              Add Database Relationship
            </h3>

            <form onSubmit={handleAddRelationship} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Entity *</label>
                <select
                  required
                  value={targetEntityId}
                  onChange={(e) => setTargetEntityId(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#6EF0FF]/30 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="">Select target entity...</option>
                  {(allEntities || [])
                    .filter((e) => e.id !== formData.id)
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.type})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship Type *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Member of, Located in, Owns, Allied with"
                  value={relType}
                  onChange={(e) => setRelType(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#6EF0FF]/30 rounded-lg px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Context regarding this relationship..."
                  value={relDesc}
                  onChange={(e) => setRelDesc(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#6EF0FF]/30 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#6EF0FF]/20">
                <button
                  type="button"
                  onClick={() => setShowAddRelModal(false)}
                  className="px-4 py-2 rounded-md bg-[#0B0B0D] text-slate-300 text-xs font-semibold border border-slate-700 hover:bg-[#181822]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#6EF0FF] text-[#0B0B0D] text-xs font-bold hover:brightness-110"
                >
                  Add Relationship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

