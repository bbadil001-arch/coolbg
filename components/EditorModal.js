import { useState } from "react";
import { X, Shuffle, Download, Link2, Code2, Check } from "lucide-react";
import { Surface } from "./Surfaces";
import { randomParams, PATTERN_SHAPES } from "../lib/generators";
import { SIZE_PRESETS, exportSVG } from "../lib/exportUtils";

function Slider({ label, value, min, max, step, onChange, suffix = "" }) {
  return (
    <label className="block">
      <div className="flex justify-between text-xs text-white/60 mb-1.5 font-mono">
        <span>{label}</span>
        <span>{value}{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-violet-500 h-1.5 rounded-full bg-white/10 cursor-pointer"
      />
    </label>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2.5">
      <div className="relative h-8 w-8 rounded-lg overflow-hidden border border-white/15 shrink-0">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute -inset-1 cursor-pointer" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-white/45 font-mono">{label}</span>
        <span className="text-xs font-mono text-white/80">{value}</span>
      </div>
    </label>
  );
}

export default function EditorModal({ card, onClose, onChange, onDownload, onShare, onCopyCSS, copied }) {
  // hooks must run every render regardless of `card`, so this state is
  // declared before the early return below
  const [sizeKey, setSizeKey] = useState("Desktop 1080p");
  if (!card) return null;
  const set = (patch) => onChange({ ...card, ...patch });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#12151C]/95 backdrop-blur-2xl flex flex-col md:flex-row shadow-2xl">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
          <X size={18} />
        </button>

        <div className="relative flex-1 min-h-[280px] md:min-h-0 bg-black/30">
          <Surface p={card} className="absolute inset-0 w-full h-full" />
        </div>

        <div className="w-full md:w-[340px] shrink-0 border-t md:border-t-0 md:border-l border-white/10 p-5 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-white">Editor</h3>
            <span className="text-[11px] font-mono uppercase tracking-wider text-violet-300 bg-violet-500/10 border border-violet-400/20 px-2 py-1 rounded-md">
              {card.type}
            </span>
          </div>

          <div className="space-y-3">
            <ColorField label="Primary" value={card.c1} onChange={(v) => set({ c1: v })} />
            <ColorField label="Secondary" value={card.c2} onChange={(v) => set({ c2: v })} />
            <ColorField label="Accent / BG" value={card.c3} onChange={(v) => set({ c3: v })} />
          </div>

          <div className="space-y-4">
            {card.type === "gradient" && (
              <Slider label="Angle" value={card.angle} min={0} max={360} step={1} suffix="°" onChange={(v) => set({ angle: v })} />
            )}
            {(card.type === "pattern" || card.type === "mesh" || card.type === "animated") && (
              <Slider label="Density" value={card.density} min={2} max={30} step={1} onChange={(v) => set({ density: v })} />
            )}
            <Slider label="Scale" value={card.scale} min={0.3} max={2.5} step={0.05} onChange={(v) => set({ scale: v })} />
            <Slider label="Noise overlay" value={card.noise} min={0} max={1} step={0.02} onChange={(v) => set({ noise: v })} />
            {card.type === "pattern" && (
              <label className="block">
                <div className="text-xs text-white/60 mb-1.5 font-mono">Shape</div>
                <select value={card.shape} onChange={(e) => set({ shape: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-2 text-sm text-white outline-none focus:border-violet-400">
                  {PATTERN_SHAPES.map((s) => <option key={s} value={s} className="bg-[#12151C]">{s}</option>)}
                </select>
              </label>
            )}
          </div>

          <button
            onClick={() => set(randomParams(card.type, { type: card.type }))}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-sm text-white py-2.5 transition-colors"
          >
            <Shuffle size={15} /> Randomize this theme
          </button>

          <div className="h-px bg-white/10" />

          <div className="space-y-2.5">
            <div className="flex gap-2">
              <select value={sizeKey} onChange={(e) => setSizeKey(e.target.value)}
                className="flex-1 bg-white/5 border border-white/15 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-violet-400">
                {Object.keys(SIZE_PRESETS).map((k) => <option key={k} value={k} className="bg-[#12151C]">{k}</option>)}
              </select>
              <button onClick={() => onDownload(card, sizeKey)}
                className="flex items-center gap-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-xs font-medium px-3 py-2 transition-colors">
                <Download size={14} /> PNG
              </button>
            </div>
            {card.type === "pattern" && (
              <button onClick={() => exportSVG(card)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-white text-xs font-medium py-2 transition-colors">
                <Download size={14} /> Download raw SVG
              </button>
            )}
            <div className="flex gap-2">
              <button onClick={() => onShare(card)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-white text-xs font-medium py-2 transition-colors">
                <Link2 size={14} /> Copy link
              </button>
              <button onClick={() => onCopyCSS(card)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-white text-xs font-medium py-2 transition-colors">
                {copied ? <Check size={14} /> : <Code2 size={14} />} {copied ? "Copied" : "Copy CSS"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
