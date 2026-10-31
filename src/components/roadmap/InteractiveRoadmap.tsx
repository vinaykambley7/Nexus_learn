import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import { LearningTrack, RoadmapNode, TrackId, NodeStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface InteractiveRoadmapProps {
  track: LearningTrack;
  onSelectTrack: (trackId: TrackId) => void;
  onSelectNode: (node: RoadmapNode) => void;
  completedNodeIds: string[];
}

export const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({
  track,
  onSelectTrack,
  onSelectNode,
  completedNodeIds,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<RoadmapNode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all nodes across levels
  const allNodes: RoadmapNode[] = track.levels.flatMap((level) => level.nodes);

  // Sort nodes by order
  const sortedNodes = [...allNodes].sort((a, b) => a.order - b.order);

  // Generate smooth SVG bezier curve path connecting nodes
  const generateCurvedPath = (nodes: RoadmapNode[]): string => {
    if (nodes.length === 0) return '';
    if (nodes.length === 1) return `M ${nodes[0].x} ${nodes[0].y}`;

    let path = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 0; i < nodes.length - 1; i++) {
      const p0 = nodes[i];
      const p1 = nodes[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.5;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.5;
      const cy2 = p1.y;
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const curvedPathD = generateCurvedPath(sortedNodes);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag when clicking background canvas
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'roadmap-viewport') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const getNodeStatus = (node: RoadmapNode): NodeStatus => {
    if (completedNodeIds.includes(node.id)) return 'completed';
    return node.status;
  };

  return (
    <div className="relative w-full h-[760px] rounded-3xl glass-panel border border-white/10 overflow-hidden select-none bg-radial-gradient">
      {/* Top Floating Header & Track Selector */}
      <div className="absolute top-6 left-6 right-6 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-none">
        {/* Track Title */}
        <div className="pointer-events-auto bg-dark-surface/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: track.accentColor + '33', border: `1px solid ${track.accentColor}` }}
            >
              {track.id === 'full-stack' && <Layers className="w-4 h-4 text-sky-400" />}
              {track.id === 'ai-tools' && <Sparkles className="w-4 h-4 text-amber-400" />}
              {track.id === 'ai-engineering' && <Cpu className="w-4 h-4 text-purple-400" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">{track.title}</h2>
              <p className="text-xs text-text-muted">{track.levelCount} Levels • {track.moduleCount} Modules • Nonlinear Path</p>
            </div>
          </div>
        </div>

        {/* Track Switcher Pills */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl bg-dark-surface/90 backdrop-blur-md border border-white/10 shadow-xl">
          <button
            onClick={() => onSelectTrack('full-stack')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              track.id === 'full-stack'
                ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full-Stack</span>
          </button>
          <button
            onClick={() => onSelectTrack('ai-tools')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              track.id === 'ai-tools'
                ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tools</span>
          </button>
          <button
            onClick={() => onSelectTrack('ai-engineering')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              track.id === 'ai-engineering'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Engineering</span>
          </button>
        </div>
      </div>

      {/* Floating Zoom & Pan Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 bg-dark-surface/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl">
        <button
          onClick={handleZoomIn}
          className="p-2.5 rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
          title="Reset Position"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Legend */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-4 bg-dark-surface/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs shadow-xl">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
          <span className="text-white">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38BDF8]" />
          <span className="text-white">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-white">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <span className="text-text-muted">Locked</span>
        </div>
      </div>

      {/* SVG Canvas Viewport */}
      <div
        id="roadmap-viewport"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
      >
        <svg
          viewBox="0 0 900 1050"
          className="w-full h-full max-w-[1100px] transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Glowing path filter */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient definition for road line */}
            <linearGradient id="roadmapGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>
          <rect width="900" height="1050" fill="url(#grid)" />

          {/* Base Curved Roadmap Connecting Line */}
          <path
            d={curvedPathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Animated Glowing Foreground Path */}
          <path
            d={curvedPathD}
            fill="none"
            stroke="url(#roadmapGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#neon-glow)"
            strokeDasharray="12 8"
            className="animate-dash"
          />

          {/* Interactive Learning Nodes */}
          {sortedNodes.map((node) => {
            const status = getNodeStatus(node);
            const isHovered = hoveredNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                {/* Node Pulsating Outer Ring for in_progress */}
                {status === 'in_progress' && (
                  <circle
                    r="40"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Outer Circular Aura */}
                <circle
                  r={isHovered ? '34' : '28'}
                  fill={
                    status === 'completed'
                      ? 'rgba(16, 185, 129, 0.25)'
                      : status === 'in_progress'
                      ? 'rgba(56, 189, 248, 0.3)'
                      : status === 'available'
                      ? 'rgba(245, 158, 11, 0.25)'
                      : 'rgba(30, 41, 59, 0.5)'
                  }
                  stroke={
                    status === 'completed'
                      ? '#10B981'
                      : status === 'in_progress'
                      ? '#38BDF8'
                      : status === 'available'
                      ? '#F59E0B'
                      : 'rgba(255, 255, 255, 0.15)'
                  }
                  strokeWidth={isHovered ? '3' : '2'}
                  filter={status !== 'locked' ? 'url(#neon-glow)' : undefined}
                  className="transition-all duration-300"
                />

                {/* Inner Core Circle */}
                <circle
                  r="20"
                  fill={
                    status === 'completed'
                      ? '#064E3B'
                      : status === 'in_progress'
                      ? '#0C4A6E'
                      : status === 'available'
                      ? '#78350F'
                      : '#1E293B'
                  }
                />

                {/* Center Status Icon */}
                {status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" x="-10" y="-10" />
                )}
                {status === 'in_progress' && (
                  <PlayCircle className="w-5 h-5 text-sky-400" x="-10" y="-10" />
                )}
                {status === 'available' && (
                  <circle r="4" fill="#F59E0B" />
                )}
                {status === 'locked' && (
                  <Lock className="w-4 h-4 text-slate-400" x="-8" y="-8" />
                )}

                {/* Node Title Label Pill */}
                <foreignObject
                  x="-110"
                  y="34"
                  width="220"
                  height="75"
                  className="pointer-events-none overflow-visible"
                >
                  <div className="flex flex-col items-center text-center">
                    <span
                      className={`text-xs font-bold font-heading px-2.5 py-1 rounded-lg backdrop-blur-md border shadow-lg truncate max-w-full transition-all ${
                        isHovered
                          ? 'bg-dark-hover text-white border-sky-400 scale-105'
                          : status === 'completed'
                          ? 'bg-dark-card/90 text-emerald-300 border-emerald-500/30'
                          : status === 'in_progress'
                          ? 'bg-dark-card/90 text-sky-300 border-sky-500/30'
                          : status === 'available'
                          ? 'bg-dark-card/90 text-amber-300 border-amber-500/30'
                          : 'bg-dark-card/90 text-text-muted border-white/10'
                      }`}
                    >
                      {node.title}
                    </span>
                    <span className="text-[10px] text-text-muted mt-0.5 font-mono">
                      {node.category} • {node.estimatedMinutes}m
                    </span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
