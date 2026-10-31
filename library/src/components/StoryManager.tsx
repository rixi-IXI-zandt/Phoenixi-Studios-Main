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
  onSaveStory: (story: Story) => boolean;
  onOpenThreads:()=>void;
  onDeleteStory: (id: string) => void;
  onEditScene: (scene: Scene) => void;
}

export const StoryManager: React.FC<StoryManagerProps> = ({
  onOpenThreads,
  initialStoryId,
  stories,
  allEntities,
  onSaveStory,
  onDeleteStory,
  onEditScene,
}) => {
  const safeStories = stories || [];
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(
    initialStoryId || null
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

    if(!onSaveStory(newStory))return;
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

  return <section className="quiet-stories">
    {selectedStory?<>
      <button className="back-action" onClick={()=>setSelectedStoryId(null)}>← All stories</button>
      <header className="quiet-heading"><h1>{selectedStory.title}</h1><details className="quiet-details story-options"><summary>Story options</summary><label>Title<input aria-label="Story title" value={selectedStory.title} onChange={e=>onSaveStory({...selectedStory,title:e.target.value})}/></label><label>Outline<textarea value={selectedStory.description} onChange={e=>onSaveStory({...selectedStory,description:e.target.value})}/></label><button onClick={handleExportDocx}>Export Story Manuscript</button><button onClick={()=>onDeleteStory(selectedStory.id)}>Delete Story</button></details></header>
      <div className="outline-heading"><h2>Chapters</h2><button onClick={handleAddChapter}>Add Chapter</button></div>
      <div className="chapter-outline">{selectedStory.chapters.map((chapter,index)=><details key={chapter.id} className="chapter-fold" open={index===0?true:undefined}><summary>{chapter.title}<small>{chapter.scenes.length} {chapter.scenes.length===1?'scene':'scenes'}</small></summary><div className="scene-list">{chapter.scenes.map(scene=><button key={scene.id} onClick={()=>onEditScene(scene)}><span>{scene.title}</span><small>{scene.wordCount||0} words</small><span aria-hidden="true">↗</span></button>)}{!chapter.scenes.length&&<p>No scenes yet.</p>}<button className="add-scene" onClick={()=>handleAddScene(chapter.id)}>Add scene</button></div><details className="quiet-details"><summary>Chapter options</summary><label>Chapter title<input aria-label={'Chapter '+(index+1)+' title'} value={chapter.title} onChange={e=>onSaveStory({...selectedStory,chapters:selectedStory.chapters.map(c=>c.id===chapter.id?{...c,title:e.target.value}:c)})}/></label><button disabled={index===0} onClick={()=>handleMoveChapter(index,'up')}>Move up</button><button disabled={index===selectedStory.chapters.length-1} onClick={()=>handleMoveChapter(index,'down')}>Move down</button></details></details>)}</div>
    </>:<><header className="quiet-heading"><h1>Stories</h1><button onClick={()=>setShowNewStoryModal(true)}>New Story</button></header>{safeStories.length?<div className="quiet-list">{safeStories.map(story=><button key={story.id} onClick={()=>setSelectedStoryId(story.id)}><span>{story.title}</span><small>{story.chapters.length} {story.chapters.length===1?'chapter':'chapters'}</small><span aria-hidden="true">↗</span></button>)}</div>:<p className="quiet-empty">Begin with a story. The chapters can come later.</p>}<details className="quiet-details"><summary>Writing tools</summary><button onClick={onOpenThreads}>Plot & Unresolved Threads</button></details></>}
    {showNewStoryModal&&<div className="modal-overlay"><form role="dialog" aria-modal="true" aria-label="New story" className="modal-card" onSubmit={handleCreateStory}><h2>New story</h2><label>Story title<input autoFocus required placeholder="Story title" value={newStoryTitle} onChange={e=>setNewStoryTitle(e.target.value)}/></label><button type="submit">Create Story</button><button type="button" onClick={()=>setShowNewStoryModal(false)}>Cancel</button></form></div>}
  </section>;
};
