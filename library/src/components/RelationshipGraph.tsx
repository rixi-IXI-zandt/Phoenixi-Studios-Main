import React, { useState, useMemo } from 'react';
import { Share2, Filter, ZoomIn, ZoomOut, RefreshCw, Layers } from 'lucide-react';
import { Entity, EntityType } from '../types';
import { IXIMark } from './PhoenixiBrand';

interface RelationshipGraphProps {
  entities: Entity[];
  onSelectEntity: (id: string) => void;
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({ entities, onSelectEntity }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Filter entities
  const displayEntities = useMemo(() => {
    if (filterType === 'all') return entities;
    return entities.filter((e) => e.type === filterType);
  }, [entities, filterType]);

  // Compute node positions in circle/grid
  const nodes = useMemo(() => {
    const safeEntities = displayEntities || [];
    const total = safeEntities.length;
    const radius = 220;
    const centerX = 350;
    const centerY = 300;

    return safeEntities.map((entity, index) => {
      const angle = (index / Math.max(total, 1)) * 2 * Math.PI;
      const x = total === 1 ? centerX : centerX + radius * Math.cos(angle);
      const y = total === 1 ? centerY : centerY + radius * Math.sin(angle);
      return { ...entity, x, y };
    });
  }, [displayEntities]);

  // Map of node locations
  const nodeMap = useMemo(() => new Map((nodes || []).map((n) => [n.id, n])), [nodes]);

  // Extract edges
  const edges = useMemo(() => {
    const list: { id: string; sourceX: number; sourceY: number; targetX: number; targetY: number; label: string; isExtracted?: boolean }[] = [];

    (nodes || []).forEach((source) => {
      (source.relationships || []).forEach((rel) => {
        const target = nodeMap.get(rel.targetId);
        if (target) {
          list.push({
            id: rel.id,
            sourceX: source.x,
            sourceY: source.y,
            targetX: target.x,
            targetY: target.y,
            label: rel.relationshipType,
            isExtracted: rel.isExtracted,
          });
        }
      });
    });

    return list;
  }, [nodes, nodeMap]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4 text-slate-100 select-none">
      <div className="bg-[#14141D] p-5 rounded-xl border border-[#E2B3FF]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 artdeco-frame">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <IXIMark />
            <h2 className="text-xl font-black text-white font-artdeco tracking-tight flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#6EF0FF]" />
              <span>Interactive Visual Relationship Graph</span>
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Visual network showing explicit database relationships between world entities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter by Type */}
          <div className="flex items-center gap-2 bg-[#0B0B0D] px-3 py-1.5 rounded-md border border-[#E2B3FF]/30 artdeco-chamfer-sm">
            <Filter className="w-3.5 h-3.5 text-[#6EF0FF]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#14141D]">All Entity Types</option>
              <option value="character" className="bg-[#14141D]">Characters</option>
              <option value="organization" className="bg-[#14141D]">Organizations</option>
              <option value="location" className="bg-[#14141D]">Locations</option>
              <option value="culture" className="bg-[#14141D]">Cultures</option>
              <option value="species" className="bg-[#14141D]">Species</option>
              <option value="discovery" className="bg-[#14141D]">Discoveries</option>
              <option value="item" className="bg-[#14141D]">Items</option>
            </select>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#0B0B0D] p-1 rounded-md border border-[#E2B3FF]/30 artdeco-chamfer-sm">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-1 text-slate-300 hover:text-white"
            >
              <ZoomOut className="w-4 h-4 text-[#6EF0FF]" />
            </button>
            <span className="text-[10px] text-slate-300 font-mono w-8 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
              className="p-1 text-slate-300 hover:text-white"
            >
              <ZoomIn className="w-4 h-4 text-[#6EF0FF]" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-300 hover:text-white ml-1 border-l border-slate-700 pl-1"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#B8FFD9]" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="artdeco-card rounded-xl shadow-2xl relative overflow-hidden min-h-[600px] flex items-center justify-center">
        {displayEntities.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-xs">
            No entities in database to plot on graph.
          </div>
        ) : (
          <svg
            width="700"
            height="600"
            viewBox="0 0 700 600"
            className="w-full h-full transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6EF0FF" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((edge) => (
              <g key={edge.id}>
                <line
                  x1={edge.sourceX}
                  y1={edge.sourceY}
                  x2={edge.targetX}
                  y2={edge.targetY}
                  stroke={edge.isExtracted ? '#B8FFD9' : '#6EF0FF'}
                  strokeWidth={edge.isExtracted ? '1.5' : '2'}
                  strokeDasharray={edge.isExtracted ? '4 2' : 'none'}
                  markerEnd="url(#arrow)"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
                <text
                  x={(edge.sourceX + edge.targetX) / 2}
                  y={(edge.sourceY + edge.targetY) / 2 - 5}
                  fill="#E2B3FF"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-mono font-bold"
                >
                  {edge.label}
                </text>
              </g>
            ))}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    r="24"
                    className={`transition-all ${
                      isSelected
                        ? 'fill-[#6EF0FF] stroke-[#E2B3FF] stroke-2'
                        : 'fill-[#0B0B0D] stroke-[#6EF0FF] hover:stroke-[#B8FFD9] stroke-2'
                    }`}
                  />
                  <text
                    y="4"
                    fill={isSelected ? '#0B0B0D' : '#ffffff'}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.name.slice(0, 3).toUpperCase()}
                  </text>
                  <text
                    y="38"
                    fill="#e2e8f0"
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="middle"
                    className="drop-shadow-md"
                  >
                    {node.name}
                  </text>
                  <text
                    y="50"
                    fill="#E2B3FF"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="uppercase"
                  >
                    {node.type}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Floating Detail Inspector */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 bg-[#14141D] border border-[#6EF0FF]/50 rounded-xl p-4 w-72 backdrop-blur shadow-2xl text-slate-100 z-10 space-y-2 artdeco-chamfer-sm">
            <div className="flex items-center justify-between border-b border-[#E2B3FF]/20 pb-2">
              <span className="text-xs font-bold uppercase text-[#6EF0FF] font-artdeco">{selectedNode.type}</span>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            </div>
            <h4 className="font-bold text-base text-white">{selectedNode.name}</h4>
            <p className="text-xs text-slate-300 line-clamp-3">{selectedNode.description || 'No description.'}</p>
            <div className="text-[11px] text-[#B8FFD9]">
              {selectedNode.relationships.length} explicit relationships
            </div>
            <button
              onClick={() => onSelectEntity(selectedNode.id)}
              className="w-full mt-2 py-1.5 rounded-md bg-[#6EF0FF] text-[#0B0B0D] text-xs font-bold hover:brightness-110 transition-all artdeco-chamfer-sm"
            >
              Open Entity Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

