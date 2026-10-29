import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  FileText,
  MoveUp,
  MoveDown,
  Download,
  Edit3,
  Layers,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Story, Chapter, Scene, Entity } from '../types';
import {id} from '../services/database';
import {proseText} from '../services/text';

interface StoryManagerProps {
  initialStoryId?: string;
  stories: Story[];
  allEntities: Entity[];
  onSaveStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onEditScene: (scene: Scene) => void;
}

export const StoryManager: React.FC<StoryManagerProps> = ({
  initialStoryId,
  stories,
  allEntities,
  onSaveStory,
  onDeleteStory,
  onEditScene,
}) => {
  const safeStories = stories || [];
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(
    initialStoryId || (safeStories.length > 0 ? safeStories[0].id : null)
  );

  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [showNewStoryModal, setShowNewStoryModal] = useState(false);

  const selectedStory = safeStories.find((s) => s.id === selectedStoryId);

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle.trim()) return;
    const storyId=id('story'), chapterId=id('chapter');
    const newStory: Story = {
      id: storyId,
      projectId: 'proj-1',
      title: newStoryTitle.trim(),
      description: '',
      status: 'Draft',
      plot: '',
      summary: '',
      chapters: [
        {
          id: chapterId,
          storyId,
          title: 'Chapter 1',
          summary: '',
          order: 0,
          scenes: [
            {
              id: `scene-${Date.now()}`,
              chapterId,
              title: 'Scene 1',
              prose: '',
              summary: '',
              appearingCharacterIds: [],
              tags: [],
              wordCount: 0,
              order: 0,
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      ],
      participatingEntityIds: [],
      tags: [],
      updatedAt: new Date().toISOString(),
    };

    onSaveStory(newStory);
    setSelectedStoryId(newStory.id);
    setNewStoryTitle('');
    setShowNewStoryModal(false);
  };

  const handleAddChapter = () => {
    if (!selectedStory) return;
    const chapters = selectedStory.chapters || [];
    const chapterId=id('chapter');
    const newChap: Chapter = {
      id: chapterId,
      storyId: selectedStory.id,
      title: `Chapter ${chapters.length + 1}`,
      summary: '',
      order: chapters.length,
      scenes: [],
    };
    const updatedStory = {
      ...selectedStory,
      chapters: [...chapters, newChap],
    };
    onSaveStory(updatedStory);
  };

  const handleAddScene = (chapterId: string) => {
    if (!selectedStory) return;
    const updatedChapters = (selectedStory.chapters || []).map((chap) => {
      if (chap.id !== chapterId) return chap;
      const scenes = chap.scenes || [];
      const newScene: Scene = {
        id: `scene-${Date.now()}`,
        chapterId: chap.id,
        title: `Scene ${scenes.length + 1}`,
        prose: '',
        summary: '',
        appearingCharacterIds: [],
        tags: [],
        wordCount: 0,
        order: scenes.length,
        updatedAt: new Date().toISOString(),
      };
      return { ...chap, scenes: [...scenes, newScene] };
    });

    onSaveStory({ ...selectedStory, chapters: updatedChapters });
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    if (!selectedStory) return;
    const chapters = [...(selectedStory.chapters || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= chapters.length) return;

    const temp = chapters[index];
    chapters[index] = chapters[targetIdx];
    chapters[targetIdx] = temp;

    onSaveStory({ ...selectedStory, chapters:chapters.map((c,i)=>({...c,order:i})) });
  };

  const handleExportDocx = () => {
    if (!selectedStory) return;
    let textContent = `# ${selectedStory.title}\n\n${selectedStory.description}\n\n`;

    (selectedStory.chapters || []).forEach((chap) => {
      textContent += `## ${chap.title}\n\n`;
      (chap.scenes || []).forEach((sc) => {
        textContent += `### ${sc.title}\n\n`;
        const cleanProse = proseText(sc.prose || '');
        textContent += `${cleanProse}\n\n`;
      });
    });

    const blob = new Blob([textContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedStory.title.toLowerCase().replace(/\s+/g, '_')}_manuscript.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Story & Chapter Environment</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize chapters, scenes, plotlines, and write manuscripts.
          </p>
        </div>

        <div className="flex gap-2">
          {selectedStory && (
            <button
              onClick={handleExportDocx}
              className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Story Manuscript</span>
            </button>
          )}

          <button
            onClick={() => setShowNewStoryModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 flex items-center gap-2 shadow-lg shadow-emerald-600/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Story</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Story selector sidebar + Chapter/Scene Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Story Sidebar list */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Stories ({safeStories.length})
          </div>

          {safeStories.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No stories created yet.</div>
          ) : (
            safeStories.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedStoryId(story.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedStoryId === story.id
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-sm line-clamp-1">{story.title}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-normal">
                  {(story.chapters || []).length} Chapters • {story.status}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Selected Story Chapters & Scenes Panel */}
        <div className="md:col-span-3 space-y-4">
          {!selectedStory ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500 text-xs">
              Select or create a story to start editing chapters and scenes.
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              {/* Story Title & Description Edit */}
              <div className="space-y-3 pb-4 border-b border-slate-800">
                <input
                  type="text"
                  value={selectedStory.title || ''}
                  onChange={(e) =>
                    onSaveStory({ ...selectedStory, title: e.target.value })
                  }
                  className="w-full bg-transparent text-xl font-black text-white focus:outline-none border-b border-transparent focus:border-emerald-500"
                />
                <textarea
                  rows={2}
                  placeholder="Story high concept or plot outline..."
                  value={selectedStory.description || ''}
                  onChange={(e) =>
                    onSaveStory({ ...selectedStory, description: e.target.value })
                  }
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200"
                />
              </div>

              {/* Chapters List & Reordering */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Chapters & Scenes Hierarchy
                  </h3>

                  <button
                    onClick={handleAddChapter}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Chapter</span>
                  </button>
                </div>

                {(selectedStory.chapters || []).map((chap, cIdx) => (
                  <div
                    key={chap.id}
                    className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3"
                  >
                    {/* Chapter Header */}
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={chap.title || ''}
                        onChange={(e) => {
                          const updated = (selectedStory.chapters || []).map((c) =>
                            c.id === chap.id ? { ...c, title: e.target.value } : c
                          );
                          onSaveStory({ ...selectedStory, chapters: updated });
                        }}
                        className="bg-transparent font-bold text-sm text-amber-400 focus:outline-none border-b border-transparent focus:border-amber-400"
                      />

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveChapter(cIdx, 'up')}
                          disabled={cIdx === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                          title="Move Chapter Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveChapter(cIdx, 'down')}
                          disabled={cIdx === (selectedStory.chapters || []).length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                          title="Move Chapter Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAddScene(chap.id)}
                          className="ml-2 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Scene</span>
                        </button>
                      </div>
                    </div>

                    {/* Scenes under this chapter */}
                    <div className="pl-4 space-y-2 border-l-2 border-slate-700/60">
                      {(chap.scenes || []).length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No scenes in this chapter yet.</div>
                      ) : (
                        (chap.scenes || []).map((scene) => (
                          <div
                            key={scene.id}
                            className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between group transition-colors"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 flex items-center gap-2">
                                <span>{scene.title}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ({scene.wordCount || 0} words)
                                </span>
                              </div>
                              {scene.summary && (
                                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {scene.summary}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => onEditScene(scene)}
                              className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Prose</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedStory&&<button className="m-6" onClick={()=>onDeleteStory(selectedStory.id)}>Delete Story</button>}
      {/* New Story Modal */}
      {showNewStoryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Create New Story Project
            </h3>
            <form onSubmit={handleCreateStory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Story Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronicles of the Ash Guard"
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewStoryModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                >
                  Create Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
