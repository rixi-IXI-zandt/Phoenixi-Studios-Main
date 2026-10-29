import React, { useState } from 'react';
import { GitMerge, Plus, CheckCircle2, AlertCircle, HelpCircle, Trash2 } from 'lucide-react';
import { PlotThread, Story, Entity } from '../types';
import { IXIMark } from './PhoenixiBrand';

interface PlotThreadsManagerProps {
  onDelete:(id:string)=>void;
  plotThreads: PlotThread[];
  stories: Story[];
  allEntities: Entity[];
  onSavePlotThread: (thread: PlotThread) => void;
}

export const PlotThreadsManager: React.FC<PlotThreadsManagerProps> = ({
  onDelete,
  plotThreads,
  stories,
  allEntities,
  onSavePlotThread,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [storyId, setStoryId] = useState(stories[0]?.id || '');
  const [status, setStatus] = useState<'active' | 'unresolved' | 'resolved'>('unresolved');

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newThread: PlotThread = {
      id: `pt-${Date.now()}`,
      projectId: 'proj-1',
      storyId,
      title: title.trim(),
      description: desc.trim(),
      status,
      associatedSceneIds: [],
      associatedCharacterIds: [],
    };
    onSavePlotThread(newThread);
    setTitle('');
    setDesc('');
    setShowAddModal(false);
  };

  const handleStatusToggle = (thread: PlotThread, newStatus: 'active' | 'unresolved' | 'resolved') => {
    onSavePlotThread({ ...thread, status: newStatus });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-100">
      <div className="bg-[#14141D] p-5 rounded-xl border border-[#E2B3FF]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 artdeco-frame">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <IXIMark />
            <h2 className="text-xl font-black text-white font-artdeco tracking-tight flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-[#E2B3FF]" />
              <span>Plotlines & Thread Resolution Tracker</span>
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Track unresolved plot points across story chapters and scenes without making up fictional conclusions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-md bg-[#6EF0FF] text-[#0B0B0D] text-xs font-bold hover:brightness-110 flex items-center gap-2 shadow-lg artdeco-chamfer-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-[#0B0B0D]" />
          <span>New Plot Thread</span>
        </button>
      </div>

      {(plotThreads || []).length === 0 ? (
        <div className="artdeco-card rounded-xl p-12 text-center text-slate-400 text-xs">
          No plot threads created yet. Track narrative promises, mysteries, and unresolved story arcs here.
        </div>
      ) : (
        <div className="space-y-3">
          {(plotThreads || []).map((pt) => (
            <div
              key={pt.id}
              className="artdeco-card rounded-xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 artdeco-chamfer-sm"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-100 text-base font-sans">{pt.title}<button className="ml-4" onClick={()=>onDelete(pt.id)}>Delete Thread</button></h3>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      pt.status === 'unresolved'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : pt.status === 'active'
                        ? 'bg-[#6EF0FF]/10 text-[#6EF0FF] border-[#6EF0FF]/30'
                        : 'bg-[#B8FFD9]/10 text-[#B8FFD9] border-[#B8FFD9]/30'
                    }`}
                  >
                    {pt.status === 'unresolved' ? 'Unresolved' : pt.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{pt.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleStatusToggle(pt, 'unresolved')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all artdeco-chamfer-sm ${
                    pt.status === 'unresolved'
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-[#0B0B0D] text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Unresolved
                </button>
                <button
                  onClick={() => handleStatusToggle(pt, 'active')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all artdeco-chamfer-sm ${
                    pt.status === 'active'
                      ? 'bg-[#6EF0FF] text-[#0B0B0D] border-[#6EF0FF]'
                      : 'bg-[#0B0B0D] text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleStatusToggle(pt, 'resolved')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all artdeco-chamfer-sm ${
                    pt.status === 'resolved'
                      ? 'bg-[#B8FFD9] text-[#0B0B0D] border-[#B8FFD9]'
                      : 'bg-[#0B0B0D] text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Plot Thread Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#14141D] border border-[#6EF0FF]/40 rounded-xl p-6 w-full max-w-md text-slate-100 shadow-2xl space-y-4 artdeco-frame">
            <h3 className="text-base font-bold text-[#6EF0FF] flex items-center gap-2 font-artdeco">
              <GitMerge className="w-5 h-5 text-[#6EF0FF]" />
              Create Plot Thread
            </h3>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#E2B3FF] mb-1">
                  Thread Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Identity of the Ash Keeper"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6EF0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E2B3FF] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Mystery details or narrative setup..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#6EF0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6EF0FF] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#0B0B0D] border border-[#6EF0FF]/30 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="unresolved">Unresolved</option>
                  <option value="active">Active Development</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2B3FF]/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md bg-[#0B0B0D] text-slate-300 text-xs font-semibold border border-slate-700 hover:bg-[#181822]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#6EF0FF] text-[#0B0B0D] text-xs font-bold hover:brightness-110 artdeco-chamfer-sm"
                >
                  Save Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

