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
    <div className="story-workspace p-6 max-w-7xl mx-auto space-y-6 text-ixi-paper">
      {/* Header */}
      <div className="bg-ixi-ink p-5 rounded-xl border border-ixi-surface shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-px-mint" />
            <span>Story & Chapter Environment</span>
          </h2>
          <p className="text-xs text-ixi-muted mt-1">
            Organize chapters, scenes, plotlines, and write manuscripts.
          </p>
        </div>

        <div className="flex gap-2">
          {selectedStory && (
            <button
              onClick={handleExportDocx}
              className="px-3.5 py-2 rounded-lg bg-ixi-surface border border-ixi-line text-px-mint text-xs font-bold hover:bg-ixi-line flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Story Manuscript</span>
            </button>
          )}

          <button
            onClick={() => setShowNewStoryModal(true)}
            className="px-4 py-2 rounded-lg bg-px-mint text-white text-xs font-bold hover:bg-px-mint flex items-center gap-2 shadow-lg shadow-px-mint/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Story</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Story selector sidebar + Chapter/Scene Hierarchy */}
      <div className="story-layout">
        {/* Story Sidebar list */}
        <div className="bg-ixi-ink border border-ixi-surface rounded-xl p-4 shadow-lg space-y-2">
          <div className="text-xs font-bold text-ixi-muted uppercase tracking-wider mb-2">
            Stories ({safeStories.length})
          </div>

          {safeStories.length === 0 ? (
            <div className="text-center py-8 text-ixi-muted text-xs">No stories created yet.</div>
          ) : (
            safeStories.map((story) => (
              <button
                key={story.id} aria-current={selectedStoryId===story.id?'true':undefined}
                onClick={() => setSelectedStoryId(story.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedStoryId === story.id
                    ? 'bg-px-mint/15 text-px-mint border-px-mint/40 font-bold'
                    : 'bg-ixi-surface/40 border-ixi-line/60 text-ixi-paper hover:bg-ixi-surface'
                }`}
              >
                <div className="text-sm line-clamp-1">{story.title}</div>
                <div className="text-[10px] text-ixi-muted mt-1 font-normal">
                  {(story.chapters || []).length} Chapters • {story.status}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Selected Story Chapters & Scenes Panel */}
        <div className="space-y-4">
          {!selectedStory ? (
            <div className="bg-ixi-ink border border-ixi-surface rounded-xl p-12 text-center text-ixi-muted text-xs">
              Select or create a story to start editing chapters and scenes.
            </div>
          ) : (
            <div className="bg-ixi-ink border border-ixi-surface rounded-xl p-6 shadow-xl space-y-6">
              {/* Story Title & Description Edit */}
              <div className="space-y-3 pb-4 border-b border-ixi-surface">
                <input
                  type="text" aria-label="Story title"
                  value={selectedStory.title || ''}
                  onChange={(e) =>
                    onSaveStory({ ...selectedStory, title: e.target.value })
                  }
                  className="w-full bg-transparent text-xl font-black text-white focus:outline-none border-b border-transparent focus:border-px-mint"
                />
                <textarea
                  rows={2}
                  placeholder="Story high concept or plot outline..."
                  value={selectedStory.description || ''}
                  onChange={(e) =>
                    onSaveStory({ ...selectedStory, description: e.target.value })
                  }
                  className="w-full bg-ixi-surface/80 border border-ixi-line/80 rounded-lg p-2.5 text-xs text-ixi-paper"
                />
              </div>

              {/* Chapters List & Reordering */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ixi-paper text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-px-mint" />
                    Chapters & Scenes Hierarchy
                  </h3>

                  <button
                    onClick={handleAddChapter}
                    className="px-3 py-1.5 rounded-lg bg-ixi-surface text-px-mint border border-ixi-line text-xs font-bold hover:bg-ixi-line flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Chapter</span>
                  </button>
                </div>

                {(selectedStory.chapters || []).map((chap, cIdx) => (
                  <div
                    key={chap.id}
                    className="bg-ixi-surface/40 border border-ixi-line/60 rounded-xl p-4 space-y-3"
                  >
                    {/* Chapter Header */}
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text" aria-label={`Chapter ${cIdx+1} title`}
                        value={chap.title || ''}
                        onChange={(e) => {
                          const updated = (selectedStory.chapters || []).map((c) =>
                            c.id === chap.id ? { ...c, title: e.target.value } : c
                          );
                          onSaveStory({ ...selectedStory, chapters: updated });
                        }}
                        className="bg-transparent font-bold text-sm text-px-cyan focus:outline-none border-b border-transparent focus:border-px-cyan"
                      />

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveChapter(cIdx, 'up')}
                          disabled={cIdx === 0}
                          className="p-1 text-ixi-muted hover:text-white disabled:opacity-30"
                          title="Move Chapter Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveChapter(cIdx, 'down')}
                          disabled={cIdx === (selectedStory.chapters || []).length - 1}
                          className="p-1 text-ixi-muted hover:text-white disabled:opacity-30"
                          title="Move Chapter Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAddScene(chap.id)}
                          className="ml-2 px-2.5 py-1 rounded bg-ixi-surface text-ixi-paper hover:text-white text-[11px] font-semibold border border-ixi-line flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Scene</span>
                        </button>
                      </div>
                    </div>

                    {/* Scenes under this chapter */}
                    <div className="pl-4 space-y-2 border-l-2 border-ixi-line/60">
                      {(chap.scenes || []).length === 0 ? (
                        <div className="text-xs text-ixi-muted italic">No scenes in this chapter yet.</div>
                      ) : (
                        (chap.scenes || []).map((scene) => (
                          <div
                            key={scene.id}
                            className="p-3 rounded-lg bg-ixi-ink border border-ixi-surface hover:border-ixi-line flex items-center justify-between group transition-colors"
                          >
                            <div>
                              <div className="text-xs font-bold text-ixi-paper group-hover:text-px-cyan flex items-center gap-2">
                                <span>{scene.title}</span>
                                <span className="text-[10px] text-ixi-muted font-mono">
                                  ({scene.wordCount || 0} words)
                                </span>
                              </div>
                              {scene.summary && (
                                <div className="text-[11px] text-ixi-muted line-clamp-1 mt-0.5">
                                  {scene.summary}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => onEditScene(scene)}
                              className="px-3 py-1 rounded-md bg-px-cyan/10 text-px-cyan border border-px-cyan/30 text-xs font-bold hover:bg-px-cyan/20 flex items-center gap-1"
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
          <div className="bg-ixi-ink border border-ixi-surface rounded-xl p-6 w-full max-w-md text-ixi-paper shadow-2xl">
            <h3 className="text-base font-bold text-px-mint mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Create New Story Project
            </h3>
            <form onSubmit={handleCreateStory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ixi-muted mb-1">
                  Story Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronicles of the Ash Guard"
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  className="w-full bg-ixi-surface border border-ixi-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-px-mint"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewStoryModal(false)}
                  className="px-4 py-2 rounded-lg bg-ixi-surface text-ixi-paper text-xs font-semibold hover:bg-ixi-line"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-px-mint text-white text-xs font-bold hover:bg-px-mint"
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
