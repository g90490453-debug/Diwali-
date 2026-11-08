import React, { useRef, useState, useEffect } from 'react';
import { Palette, Download, Trash2, Undo, Sparkles } from 'lucide-react';
import { festiveAudio } from '../../utils/audio';

const RANGOLI_COLORS = [
  { name: 'Turmeric Gold', hex: '#fbbf24' },
  { name: 'Vermilion Sindoor', hex: '#ef4444' },
  { name: 'Peacock Cyan', hex: '#06b6d4' },
  { name: 'Gulal Pink', hex: '#ec4899' },
  { name: 'Emerald Leaf', hex: '#10b981' },
  { name: 'Sacred White', hex: '#ffffff' },
  { name: 'Deep Purple', hex: '#a855f7' },
  { name: 'Orange Marigold', hex: '#f97316' },
];

export const BuildRangoliGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#fbbf24');
  const [brushSize] = useState(4);
  const [symmetry, setSymmetry] = useState<4 | 8>(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dark background
    ctx.fillStyle = '#0a0214';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw faint concentric guide circles
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    [40, 80, 120, 160].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Save initial state
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setHistory((prev) => [...prev.slice(-12), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = [...history];
    nextHistory.pop();
    const prevImage = nextHistory[nextHistory.length - 1];
    ctx.putImageData(prevImage, 0, 0);
    setHistory(nextHistory);
    festiveAudio.playDiyaLightSound();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0214';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw faint guide circles
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    [40, 80, 120, 160].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    saveHistory();
    festiveAudio.playSparklerSound();
  };

  const drawSymmetricPoints = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const baseAngle = Math.atan2(dy, dx);

    ctx.fillStyle = selectedColor;
    ctx.shadowColor = selectedColor;
    ctx.shadowBlur = 6;

    const folds = symmetry;
    const angleStep = (Math.PI * 2) / folds;

    for (let i = 0; i < folds; i++) {
      const angle = baseAngle + i * angleStep;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;

      ctx.beginPath();
      ctx.arc(px, py, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    drawSymmetricPoints(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    drawSymmetricPoints(x, y);
  };

  const handlePointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    festiveAudio.playFireworkSound();
    const link = document.createElement('a');
    link.download = 'my_diwali_rangoli.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const stampMotif = (emoji: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    festiveAudio.playDiyaLightSound();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const folds = symmetry;
    const angleStep = (Math.PI * 2) / folds;
    const radius = 95;

    for (let i = 0; i < folds; i++) {
      const angle = i * angleStep;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      ctx.fillText(emoji, px, py);
    }
    saveHistory();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-fuchsia-400" />
            <span>Build Your Own Rangoli</span>
          </h3>
          <p className="text-xs text-amber-200/70">Create glowing radial mandalas with colorful powder!</p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save PNG</span>
        </button>
      </div>

      {/* Rangoli Color Palette */}
      <div className="w-full flex items-center justify-between gap-1.5 p-2 bg-black/40 rounded-xl border border-amber-500/20 mb-3 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {RANGOLI_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setSelectedColor(c.hex)}
              style={{ backgroundColor: c.hex }}
              className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                selectedColor === c.hex ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#090214]' : 'hover:scale-110'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Symmetry toggle (4x or 8x) */}
        <div className="flex items-center gap-1 pl-2 border-l border-amber-500/20 text-xs">
          <button
            type="button"
            onClick={() => setSymmetry(4)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
              symmetry === 4 ? 'bg-amber-400 text-stone-950' : 'text-amber-300/80 hover:text-white'
            }`}
          >
            4-Fold
          </button>
          <button
            type="button"
            onClick={() => setSymmetry(8)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
              symmetry === 8 ? 'bg-amber-400 text-stone-950' : 'text-amber-300/80 hover:text-white'
            }`}
          >
            8-Fold
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-inner">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-[320px] sm:w-[360px] h-[320px] sm:h-[360px] touch-none cursor-crosshair bg-[#0a0214]"
        />
      </div>

      {/* Stamps & Controls Bar */}
      <div className="w-full flex items-center justify-between gap-2 mt-3 pt-2 border-t border-amber-500/20 text-xs">
        {/* Stamp tools */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-amber-300 font-semibold uppercase">Stamps:</span>
          {['🪔', '🪷', '🌸', '✨', '🦚'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => stampMotif(st)}
              className="p-1 rounded-lg bg-black/40 hover:bg-amber-500/20 text-base transition-transform active:scale-90 cursor-pointer"
              title={`Stamp ${st}`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-300 disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-950/60 border border-amber-500/30 text-rose-300 cursor-pointer"
            title="Clear Canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
