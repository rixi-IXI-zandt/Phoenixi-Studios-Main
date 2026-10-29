import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Table,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  Save,
  Users,
  MapPin,
  Tag,
  Clock,
  BookOpen,
  Eye,
} from 'lucide-react';
import { Scene, Entity } from '../types';
import {cleanProse} from '../services/text';
import {download} from '../services/database';

interface WritingEditorProps {
  scene: Scene;
  allEntities: Entity[];
  onSaveScene: (scene: Scene) => boolean;
  onDirtyChange: (dirty: boolean) => void;
  onBack: () => void;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({
  scene,
  allEntities,
  onSaveScene,
  onDirtyChange,
  onBack,
}) => {
  const [prose, setProse] = useState(cleanProse(scene.prose || ''));
  const [title, setTitle] = useState(scene.title || 'Untitled Scene');
  const [summary, setSummary] = useState(scene.summary || '');
  const [povCharacterId, setPovCharacterId] = useState(scene.povCharacterId || '');
  const [appearingCharacterIds, setAppearingCharacterIds] = useState<string[]>(
    scene.appearingCharacterIds || []
  );
  const [locationId, setLocationId] = useState(scene.locationId || '');
  const [dateTimeText, setDateTimeText] = useState(scene.dateTimeText || '');
  const [zenMode, setZenMode] = useState(false);

  const characterEntities = allEntities.filter((e) => e.type === 'character');
  const locationEntities = allEntities.filter((e) => e.type === 'location');

  const editorRef = useRef<HTMLDivElement>(null);

  // Sync initial state
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== prose) {
      editorRef.current.innerHTML = cleanProse(prose);
    }
  }, [scene.id]);

  const calculateWordCount = (text: string) => {
    const clean = text.replace(/<[^>]*>/g, ' ').trim();
    return clean ? clean.split(/\s+/).length : 0;
  };

  const calculateCharCount = (text: string) => {
    return text.replace(/<[^>]*>/g, '').length;
  };

  const handleFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setProse(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setProse(editorRef.current.innerHTML);
    }
  };

  const handleSave = () => {
    const wordCount = calculateWordCount(prose);
    const updated: Scene = {
      ...scene,
      title,
      prose: cleanProse(prose),
      summary,
      povCharacterId,
      appearingCharacterIds,
      locationId,
      dateTimeText,
      wordCount,
      updatedAt: new Date().toISOString(),
    };
    onSaveScene(updated);
  };

  const toggleAppearingCharacter = (charId: string) => {
    if (appearingCharacterIds.includes(charId)) {
      setAppearingCharacterIds(appearingCharacterIds.filter((id) => id !== charId));
    } else {
      setAppearingCharacterIds([...appearingCharacterIds, charId]);
    }
  };

  useEffect(()=>{onDirtyChange(prose!==cleanProse(scene.prose||'')||title!==scene.title||summary!==scene.summary||povCharacterId!==(scene.povCharacterId||'')||locationId!==(scene.locationId||'')||dateTimeText!==(scene.dateTimeText||'')||JSON.stringify(appearingCharacterIds)!==JSON.stringify(scene.appearingCharacterIds||[]));},[prose,title,summary,povCharacterId,locationId,dateTimeText,appearingCharacterIds,scene]);
  const currentWordCount = calculateWordCount(prose);
  const currentCharCount = calculateCharCount(prose);

  return (
    <div
      className={`${
        zenMode
          ? 'fixed inset-0 z-50 bg-slate-950 p-8 flex flex-col justify-between text-slate-100 overflow-y-auto'
          : 'p-6 max-w-5xl mx-auto space-y-6 text-slate-100'
      }`}
    >
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          {!zenMode && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              ← Back to Story
            </button>
          )}

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-lg font-bold text-white focus:outline-none border-b border-transparent focus:border-amber-500 px-1 py-0.5"
            placeholder="Scene Title..."
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-400 font-mono hidden sm:block mr-2">
            {currentWordCount} words • {currentCharCount} chars
          </div>

          <button
            onClick={() => setZenMode(!zenMode)}
            className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
              zenMode
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Distraction-Free Zen Writing Mode"
          >
            {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Scene</span>
          </button>
        </div>
      </div>

      <button onClick={()=>download('scene-draft.html',cleanProse(prose),'text/html')}>Download current draft</button>
      {/* Formatting Toolbar */}
      {!zenMode && (
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex flex-wrap items-center gap-1 text-slate-300">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="p-1.5 hover:bg-slate-800 rounded font-bold"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="p-1.5 hover:bg-slate-800 rounded italic"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('underline')}
            className="p-1.5 hover:bg-slate-800 rounded underline"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() => handleFormat('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-800 rounded"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('insertOrderedList')}
            className="p-1.5 hover:bg-slate-800 rounded"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('formatBlock', 'blockquote')}
            className="p-1.5 hover:bg-slate-800 rounded"
            title="Quote Block"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() => handleFormat('undo')}
            className="p-1.5 hover:bg-slate-800 rounded"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('redo')}
            className="p-1.5 hover:bg-slate-800 rounded"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Rich Prose Area */}
      <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl ${zenMode ? 'max-w-3xl mx-auto w-full my-auto' : ''}`}>
        <div
          ref={editorRef}
          onPaste={e=>{e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'));handleInput();}} contentEditable
          onInput={handleInput}
          className="min-h-[400px] focus:outline-none text-slate-100 text-sm leading-relaxed prose prose-invert max-w-none font-serif"
          role="textbox" aria-label="Scene prose" aria-multiline="true" data-placeholder="Start writing scene prose..."
        />
      </div>

      {/* Scene Metadata Controls */}
      {!zenMode && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Scene Metadata & Participating Entities
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* POV Character */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                POV Character
              </label>
              <select
                value={povCharacterId}
                onChange={(e) => setPovCharacterId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
              >
                <option value="">None / Omniscient POV</option>
                {characterEntities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Scene Location */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Scene Location
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
              >
                <option value="">Unset Location</option>
                {locationEntities.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Appearing Characters */}
            <div className="md:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Appearing Characters
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {characterEntities.map((c) => {
                  const isAppearing = appearingCharacterIds.includes(c.id);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleAppearingCharacter(c.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        isAppearing
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scene Summary */}
            <div className="md:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">
                Scene Summary
              </label>
              <textarea
                rows={2}
                placeholder="High-level scene summary..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
