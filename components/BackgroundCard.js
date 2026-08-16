import { Maximize2, Download, Share2, Code2, Check } from "lucide-react";
import { Surface } from "./Surfaces";

function IconButton({ icon: Icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex items-center justify-center h-9 w-9 rounded-lg backdrop-blur-md border transition-all
        ${active ? "bg-violet-500/90 border-violet-400 text-white" : "bg-white/10 border-white/15 text-white hover:bg-white/20"}`}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );
}

export default function BackgroundCard({ card, onOpenEditor, onDownload, onShare, onCopyCSS, copiedId }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-[#12151C] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
      <Surface p={card} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
        <span className="text-[11px] font-mono uppercase tracking-wider text-white/70 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
          {card.type}
        </span>
        <div className="flex gap-1.5">
          <IconButton icon={Maximize2} label="Edit / fullscreen preview" onClick={() => onOpenEditor(card)} />
          <IconButton icon={Download} label="Download" onClick={() => onDownload(card)} />
          <IconButton icon={Share2} label="Share" onClick={() => onShare(card)} />
          <IconButton
            icon={copiedId === card.id ? Check : Code2}
            label="Copy CSS"
            onClick={() => onCopyCSS(card)}
            active={copiedId === card.id}
          />
        </div>
      </div>
    </div>
  );
}
