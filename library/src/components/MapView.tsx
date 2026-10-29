import React, { useState } from 'react';
import { MapPin, Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import { MapObject, MapMarker, Entity } from '../types';
import { IXIMark } from './PhoenixiBrand';
import {imageURL,imageFile} from '../services/text';

interface MapViewProps {
  onDelete:(id:string)=>void;
  maps: MapObject[];
  allEntities: Entity[];
  onSaveMap: (map: MapObject) => boolean;
  onSelectLocationEntity: (id: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  onDelete,
  maps,
  allEntities,
  onSaveMap,
  onSelectLocationEntity,
}) => {
  const safeMaps = maps || [];
  const [selectedMapId, setSelectedMapId] = useState<string | null>(
    safeMaps.length > 0 ? safeMaps[0].id : null
  );

  const [mapTitle, setMapTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError,setImageError]=useState('');
  const [showAddMapModal, setShowAddMapModal] = useState(false);

  // Marker addition state
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [pendingMarkerPos, setPendingMarkerPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedLocId, setSelectedLocId] = useState('');

  const locationEntities = (allEntities || []).filter((e) => e.type === 'location');
  const activeMap = safeMaps.find((m) => m.id === selectedMapId);

  const handleCreateMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapTitle.trim()) return;
    if(imageUrl&&!imageURL(imageUrl)){setImageError('Use an HTTPS image from a non-Google host, or upload an image.');return;}
    const newMap: MapObject = {
      id: `map-${Date.now()}`,
      projectId: 'proj-1',
      title: mapTitle.trim(),
      imageUrl: imageUrl.trim() || undefined,
      markers: [],
    };
    if(!onSaveMap(newMap))return;
    setSelectedMapId(newMap.id);
    setMapTitle('');
    setImageUrl('');
    setShowAddMapModal(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeMap) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setPendingMarkerPos({ x, y });
    setShowMarkerModal(true);
  };

  const handleAddMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMap || !pendingMarkerPos || !selectedLocId) return;

    const loc = locationEntities.find((l) => l.id === selectedLocId);
    const newMarker: MapMarker = {
      id: `marker-${Date.now()}`,
      locationId: selectedLocId,
      x: pendingMarkerPos.x,
      y: pendingMarkerPos.y,
      label: loc?.name || 'Location',
    };

    const updatedMap: MapObject = {
      ...activeMap,
      markers: [...(activeMap.markers || []), newMarker],
    };

    onSaveMap(updatedMap);
    setShowMarkerModal(false);
    setPendingMarkerPos(null);
    setSelectedLocId('');
  };

  const handleRemoveMarker = (markerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeMap) return;
    const updated = {
      ...activeMap,
      markers: (activeMap.markers || []).filter((m) => m.id !== markerId),
    };
    onSaveMap(updated);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100 select-none">
      <div className="bg-[#14141D] p-5 rounded-xl border border-[#E2B3FF]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 artdeco-frame">
        <div className="flex items-center gap-3">
          <IXIMark />
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 font-artdeco">
              <MapPin className="w-5 h-5 text-[#6EF0FF]" />
              <span>Interactive World Maps</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Place location markers referencing actual world database Location entities.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddMapModal(true)}
          className="px-4 py-2.5 rounded-lg bg-[#6EF0FF]/10 text-[#6EF0FF] border border-[#6EF0FF]/40 hover:bg-[#6EF0FF]/20 text-xs font-bold flex items-center gap-2 transition-all shrink-0 artdeco-chamfer-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Map</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Map List Sidebar */}
        <div className="bg-[#14141D] border border-[#E2B3FF]/20 rounded-xl p-4 shadow-lg space-y-2 artdeco-card">
          <div className="text-xs font-bold text-[#E2B3FF] uppercase tracking-wider mb-2 font-artdeco">
            World Maps ({safeMaps.length})
          </div>

          {safeMaps.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No maps created yet.</div>
          ) : (
            safeMaps.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMapId(m.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors artdeco-chamfer-sm ${
                  selectedMapId === m.id
                    ? 'bg-[#6EF0FF]/15 text-[#6EF0FF] border-[#6EF0FF]/50 font-bold'
                    : 'bg-[#0B0B0D]/60 border-[#E2B3FF]/20 text-slate-300 hover:bg-[#0B0B0D]'
                }`}
              >
                <div className="text-sm line-clamp-1">{m.title}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-normal">
                  {(m.markers || []).length} markers placed
                </div>
              </button>
            ))
          )}
        </div>

        {/* Map Canvas */}
        <div className="md:col-span-3">
          {!activeMap ? (
            <div className="bg-[#14141D] border border-[#E2B3FF]/20 rounded-xl p-16 text-center text-slate-400 text-xs artdeco-frame">
              Select or create a map to place location markers.
            </div>
          ) : (
            <div className="bg-[#14141D] border border-[#E2B3FF]/20 rounded-xl p-4 shadow-xl space-y-3 artdeco-frame">
              <div className="text-xs text-[#E2B3FF] font-medium">
                Click anywhere on the map grid below to place a location marker.
              </div>

              <div
                onClick={handleCanvasClick}
                className="relative w-full h-[500px] bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg overflow-hidden cursor-crosshair flex items-center justify-center bg-grid-pattern"
                style={{
                  backgroundImage: imageURL(activeMap.imageUrl||'') ? `url("${imageURL(activeMap.imageUrl||'').replace(/"/g,'%22')}")` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!activeMap.imageUrl && (
                  <div className="text-center text-slate-500 text-xs pointer-events-none">
                    [ Map Canvas Grid • Click to add location marker ]
                  </div>
                )}

                {/* Placed Markers */}
                {(activeMap.markers || []).map((marker) => (
                  <div
                    key={marker.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLocationEntity(marker.locationId);
                    }}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-full bg-[#6EF0FF] text-[#0B0B0D] shadow-lg shadow-[#6EF0FF]/50 border border-[#B8FFD9] hover:scale-125 transition-transform flex items-center justify-center">
                      <MapPin className="w-4 h-4 fill-[#6EF0FF]" />
                    </div>

                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#0B0B0D]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-[#E2B3FF]/30 whitespace-nowrap shadow-xl flex items-center gap-1 artdeco-chamfer-sm">
                      <span>{marker.label}</span>
                      <button
                        onClick={(evt) => handleRemoveMarker(marker.id, evt)}
                        className="text-slate-400 hover:text-rose-400 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {activeMap&&<button onClick={()=>onDelete(activeMap.id)}>Delete Map</button>}
      {/* Add Map Modal */}
      {showAddMapModal && (
        <div className="fixed inset-0 bg-[#0B0B0D]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#14141D] border border-[#E2B3FF]/30 rounded-xl p-6 w-full max-w-md text-slate-100 shadow-2xl space-y-4 artdeco-frame">
            <h3 className="text-base font-bold text-[#6EF0FF] flex items-center gap-2 font-artdeco">
              <MapPin className="w-5 h-5 text-[#6EF0FF]" />
              Create World Map
            </h3>

            <form onSubmit={handleCreateMap} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Map Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Continental Cartography"
                  value={mapTitle}
                  onChange={(e) => setMapTitle(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6EF0FF]"
                />
              </div>

              <div>
                <label>Upload map image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={async e=>{const f=e.target.files?.[0];if(f)try{setImageUrl(await imageFile(f));setImageError('');}catch(e){setImageError(e.message);}}}/></label>
                {imageError&&<p role="alert">{imageError}</p>}
                <label className="block text-xs font-semibold text-slate-400 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6EF0FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMapModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#0B0B0D] border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-[#181825] artdeco-chamfer-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#6EF0FF]/10 text-[#6EF0FF] border border-[#6EF0FF]/40 hover:bg-[#6EF0FF]/20 text-xs font-bold artdeco-chamfer-sm"
                >
                  Create Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marker Modal */}
      {showMarkerModal && (
        <div className="fixed inset-0 bg-[#0B0B0D]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#14141D] border border-[#E2B3FF]/30 rounded-xl p-6 w-full max-w-md text-slate-100 shadow-2xl space-y-4 artdeco-frame">
            <h3 className="text-base font-bold text-[#6EF0FF] flex items-center gap-2 font-artdeco">
              <MapPin className="w-5 h-5 text-[#6EF0FF]" />
              Place Location Marker
            </h3>

            <form onSubmit={handleAddMarker} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Select Database Location Entity *
                </label>
                <select
                  required
                  value={selectedLocId}
                  onChange={(e) => setSelectedLocId(e.target.value)}
                  className="w-full bg-[#0B0B0D] border border-[#E2B3FF]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6EF0FF]"
                >
                  <option value="">Select location entity...</option>
                  {locationEntities.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMarkerModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#0B0B0D] border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-[#181825] artdeco-chamfer-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#6EF0FF]/10 text-[#6EF0FF] border border-[#6EF0FF]/40 hover:bg-[#6EF0FF]/20 text-xs font-bold artdeco-chamfer-sm"
                >
                  Place Marker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
