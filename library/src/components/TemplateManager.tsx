import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Save, MoveUp, MoveDown } from 'lucide-react';
import { CustomTemplate, EntityType, TemplateField, FieldType } from '../types';
import { IXIMark } from './PhoenixiBrand';

interface TemplateManagerProps {
  templates: CustomTemplate[];
  onSaveTemplate: (template: CustomTemplate) => boolean;
  onDirtyChange:(dirty:boolean)=>void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({ templates, onSaveTemplate, onDirtyChange }) => {
  const [selectedType, setSelectedType] = useState<EntityType>('character');

  const currentTemplate = templates.find((t) => t.entityType === selectedType) || {
    id: `tpl-${selectedType}`,
    projectId: 'proj-1',
    entityType: selectedType,
    name: `${selectedType.toUpperCase()} Schema Template`,
    fields: [],
  };

  const [activeTemplate, setActiveTemplate] = useState<CustomTemplate>({ ...currentTemplate });
  React.useEffect(()=>{const saved=templates.find(t=>t.entityType===selectedType);if(saved)setActiveTemplate({...saved});},[JSON.stringify(templates)]);

  const handleTypeSelect = (type: EntityType) => {
    if(JSON.stringify(activeTemplate)!==JSON.stringify(currentTemplate)&&!window.confirm('Discard unsaved template edits?'))return;
    setSelectedType(type);
    const found = templates.find((t) => t.entityType === type) || {
      id: `tpl-${type}`,
      projectId: 'proj-1',
      entityType: type,
      name: `${type.toUpperCase()} Schema Template`,
      fields: [],
    };
    setActiveTemplate({ ...found });
  };

  React.useEffect(()=>{onDirtyChange(JSON.stringify(activeTemplate)!==JSON.stringify(currentTemplate));},[activeTemplate,templates]);
  const handleAddField = () => {
    const newField: TemplateField = {
      id: `f-${Date.now()}`,
      name: 'New Custom Field',
      fieldType: 'text',
    };
    setActiveTemplate((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const handleUpdateField = (id: string, updates: Partial<TemplateField>) => {
    setActiveTemplate((prev) => ({
      ...prev,
      fields: (prev.fields || []).map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  };

  const handleRemoveField = (id: string) => {
    setActiveTemplate((prev) => ({
      ...prev,
      fields: (prev.fields || []).filter((f) => f.id !== id),
    }));
  };

  const handleSave = () => {
    if(onSaveTemplate(activeTemplate))onDirtyChange(false);
  };

  const entityTypesList: EntityType[] = [
    'character',
    'organization',
    'location',
    'culture',
    'species',
    'discovery',
    'item',
    'structure',
    'room',
    'pantheon',
    'event',
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-ixi-paper">
      <div className="bg-ixi-surface p-5 rounded-xl border border-[#E2B3FF]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 artdeco-frame">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <IXIMark />
            <h2 className="text-xl font-black text-white font-artdeco tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#6EF0FF]" />
              <span>Custom Entity Schema Templates</span>
            </h2>
          </div>
          <p className="text-xs text-ixi-paper">
            Configure custom fields for world entities.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-md bg-gradient-to-r from-[#6EF0FF] to-[#E2B3FF] text-[#0B0B0D] text-xs font-bold hover:brightness-110 flex items-center gap-2 shadow-lg artdeco-chamfer-sm transition-all shrink-0"
        >
          <Save className="w-4 h-4 text-[#0B0B0D]" />
          <span>Save Template</span>
        </button>
      </div>

      {/* Entity Type Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#E2B3FF]/20">
        {entityTypesList.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeSelect(type)}
            className={`px-3.5 py-2 rounded-md text-xs font-bold uppercase transition-all shrink-0 artdeco-chamfer-sm ${
              selectedType === type
                ? 'bg-[#6EF0FF] text-[#0B0B0D]'
                : 'bg-ixi-ink border border-[#E2B3FF]/30 text-ixi-paper hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Field List Configuration */}
      <div className="artdeco-card rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2B3FF]/20 pb-3">
          <h3 className="font-bold text-ixi-paper text-sm font-artdeco tracking-wider">
            Schema Fields for {selectedType.toUpperCase()} ({(activeTemplate.fields || []).length})
          </h3>

          <button
            onClick={handleAddField}
            className="px-3 py-1.5 rounded-md bg-ixi-ink text-[#6EF0FF] border border-[#6EF0FF]/40 text-xs font-bold hover:border-[#6EF0FF] flex items-center gap-1.5 artdeco-chamfer-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Field</span>
          </button>
        </div>

        {(activeTemplate.fields || []).length === 0 ? (
          <div className="text-center py-10 text-ixi-muted text-xs">
            No custom schema fields defined for {selectedType}. Click "Add Custom Field" to extend this entity schema.
          </div>
        ) : (
          <div className="space-y-3">
            {(activeTemplate.fields || []).map((field, idx) => (
              <div
                key={field.id}
                className="p-4 rounded-md bg-ixi-ink border border-[#E2B3FF]/20 grid grid-cols-1 md:grid-cols-12 gap-3 items-center artdeco-chamfer-sm"
              >
                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-[#E2B3FF] uppercase mb-1">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                    className="w-full bg-ixi-surface border border-[#E2B3FF]/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6EF0FF]"
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-[10px] font-bold text-[#6EF0FF] uppercase mb-1">
                    Field Data Type
                  </label>
                  <select
                    value={field.fieldType}
                    onChange={(e) =>
                      handleUpdateField(field.id, { fieldType: e.target.value as FieldType })
                    }
                    className="w-full bg-ixi-surface border border-[#6EF0FF]/30 rounded-lg px-3 py-1.5 text-xs text-ixi-paper focus:outline-none focus:border-[#6EF0FF]"
                  >
                    <option value="text">Single Line Text</option>
                    <option value="longtext">Long Text / Paragraph</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean (Yes/No)</option>
                    <option value="date">Date</option>
                    <option value="select">Select Option</option>
                    <option value="multiselect">Multiple Options</option>
                    <option value="entity_ref">Entity Reference</option>
                    <option value="entity_ref_list">Multiple Entity References</option>
                    <option value="image">Image URL</option>
                    <option value="url">URL</option>
                  </select>
                  <label><input type="checkbox" checked={!!field.required} onChange={e=>handleUpdateField(field.id,{required:e.target.checked})}/> Required</label>
                  {['select','multiselect'].includes(field.fieldType)&&<label>Options (one per line)<textarea value={(field.options||[]).join('\n')} onChange={e=>handleUpdateField(field.id,{options:e.target.value.split('\n')})}/></label>}
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="p-2 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs artdeco-chamfer-sm"
                    title="Remove Field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

