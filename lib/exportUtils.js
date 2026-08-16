import { buildPatternSVG, drawMesh } from "./generators";

export const SIZE_PRESETS = {
  "Desktop 1080p": { w: 1920, h: 1080 },
  "Mobile Portrait": { w: 1080, h: 1920 },
  "4K": { w: 3840, h: 2160 },
};

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

export async function exportPNG(p, sizeKey) {
  const { w, h } = SIZE_PRESETS[sizeKey];
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");

  if (p.type === "gradient") {
    const rad = (p.angle * Math.PI) / 180;
    const x2 = Math.cos(rad), y2 = Math.sin(rad);
    const grad = ctx.createLinearGradient(w * (0.5 - x2 / 2), h * (0.5 - y2 / 2), w * (0.5 + x2 / 2), h * (0.5 + y2 / 2));
    grad.addColorStop(0, p.c1); grad.addColorStop(0.55, p.c2); grad.addColorStop(1, p.c3);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  } else if (p.type === "pattern") {
    const svgStr = buildPatternSVG(p, w, h);
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
  } else {
    drawMesh(ctx, w, h, p, 0);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      downloadBlob(blob, `coolbg-${p.type}-${sizeKey.replace(/\s+/g, "-").toLowerCase()}.png`);
      resolve();
    }, "image/png");
  });
}

export function exportSVG(p) {
  const svgStr = buildPatternSVG(p, 1600, 1200);
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  downloadBlob(blob, `coolbg-pattern-${p.seed}.svg`);
}
