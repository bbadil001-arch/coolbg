/* ============================================================================
   Procedural background engine — pure functions, no DOM, safe to import
   anywhere (pages, components, or a future API route).
   ========================================================================== */

// seeded RNG (mulberry32) — same params always produce the same visual,
// which is what makes share links and static-export pages deterministic.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const CATEGORIES = ["Gradients", "SVG Patterns", "Mesh Canvas", "Animated"];
export const TYPE_BY_CATEGORY = {
  Gradients: "gradient",
  "SVG Patterns": "pattern",
  "Mesh Canvas": "mesh",
  Animated: "animated",
};
export const PATTERN_SHAPES = ["circles", "triangles", "grid", "waves"];

export const PALETTES = [
  ["#7C5CFC", "#FF6EC7", "#0B0E14"],
  ["#00D4B8", "#3B82F6", "#0B0E14"],
  ["#FF6B4A", "#FFD23F", "#1A0B14"],
  ["#22D3EE", "#A78BFA", "#0B0E14"],
  ["#F472B6", "#FB923C", "#111827"],
  ["#34D399", "#FACC15", "#0B0E14"],
  ["#818CF8", "#F472B6", "#0B0E14"],
  ["#F43F5E", "#8B5CF6", "#111827"],
];

export function randomParams(type, overrides = {}) {
  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const base = {
    type,
    c1: palette[0],
    c2: palette[1],
    c3: palette[2],
    angle: Math.floor(Math.random() * 360),
    density: 6 + Math.floor(Math.random() * 18),
    scale: +(0.6 + Math.random() * 1.2).toFixed(2),
    noise: +(Math.random() * 0.35).toFixed(2),
    shape: PATTERN_SHAPES[Math.floor(Math.random() * PATTERN_SHAPES.length)],
    seed: Math.floor(Math.random() * 1e9),
  };
  return { ...base, ...overrides };
}

export function makeCard(type) {
  return { id: `${type}-${Math.random().toString(36).slice(2, 9)}`, ...randomParams(type) };
}

export function gradientCSSString(p) {
  return `linear-gradient(${p.angle}deg, ${p.c1} 0%, ${p.c2} 55%, ${p.c3} 100%)`;
}

export function buildPatternSVG(p, w = 400, h = 300) {
  const rand = mulberry32(p.seed);
  const colors = [p.c1, p.c2, p.c3];
  let shapes = "";
  const count = p.density;

  if (p.shape === "grid") {
    const gap = Math.max(14, 46 / p.scale);
    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        if (rand() > 0.55) continue;
        const r = (2 + rand() * 6) * p.scale;
        shapes += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${colors[Math.floor(rand() * 3)]}" opacity="${(0.35 + rand() * 0.5).toFixed(2)}"/>`;
      }
    }
  } else if (p.shape === "waves") {
    for (let i = 0; i < count; i++) {
      const y = (h / count) * i;
      const amp = 8 + rand() * 22 * p.scale;
      const col = colors[i % 3];
      shapes += `<path d="M0 ${y} Q ${w / 4} ${y - amp} ${w / 2} ${y} T ${w} ${y}" stroke="${col}" stroke-width="${(1.5 + rand() * 2).toFixed(1)}" fill="none" opacity="${(0.3 + rand() * 0.5).toFixed(2)}"/>`;
    }
  } else if (p.shape === "triangles") {
    for (let i = 0; i < count; i++) {
      const cx = rand() * w, cy = rand() * h;
      const s = (12 + rand() * 34) * p.scale;
      const rot = rand() * 360;
      const col = colors[Math.floor(rand() * 3)];
      shapes += `<polygon points="0,${-s} ${s * 0.87},${s * 0.5} ${-s * 0.87},${s * 0.5}" fill="${col}" opacity="${(0.35 + rand() * 0.5).toFixed(2)}" transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) rotate(${rot.toFixed(0)})"/>`;
    }
  } else {
    for (let i = 0; i < count; i++) {
      const cx = rand() * w, cy = rand() * h;
      const r = (6 + rand() * 30) * p.scale;
      const col = colors[Math.floor(rand() * 3)];
      shapes += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${col}" opacity="${(0.3 + rand() * 0.55).toFixed(2)}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="${p.c3}"/>${shapes}</svg>`;
}

// draw mesh blobs onto a 2d canvas context; time=0 for a static mesh, or a
// growing ms value for the animated variant
export function drawMesh(ctx, w, h, p, time = 0) {
  const rand = mulberry32(p.seed);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = p.c3;
  ctx.fillRect(0, 0, w, h);

  const colors = [p.c1, p.c2, p.c1, p.c2, p.c3];
  const blobCount = 4 + Math.round(p.density / 4);
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < blobCount; i++) {
    const bx0 = rand() * w, by0 = rand() * h;
    const speed = 0.00025 + rand() * 0.0004;
    const phase = rand() * Math.PI * 2;
    const bx = bx0 + Math.sin(time * speed + phase) * w * 0.12;
    const by = by0 + Math.cos(time * speed * 1.3 + phase) * h * 0.12;
    const radius = (Math.max(w, h) * (0.22 + rand() * 0.28)) * p.scale;
    const color = colors[i % colors.length];
    const grad = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bx, by, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  // lightweight speckle noise — cheaper/safer than a getImageData pixel pass
  if (p.noise > 0) {
    const dotCount = Math.floor(p.noise * 220);
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < dotCount; i++) {
      const x = rand() * w, y = rand() * h;
      ctx.fillStyle = rand() > 0.5 ? "#ffffff" : "#000000";
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
  }
}

export function cssForCard(p) {
  if (p.type === "gradient") {
    return `background: ${gradientCSSString(p)};`;
  }
  if (p.type === "pattern") {
    const svg = buildPatternSVG(p, 400, 300).replace(/#/g, "%23").replace(/\s+/g, " ");
    return `background-color: ${p.c3};\nbackground-image: url("data:image/svg+xml,${svg}");\nbackground-size: cover;`;
  }
  return `/* ${p.type === "animated" ? "Animated" : "Mesh"} canvas backgrounds are rendered procedurally.\n   Export a PNG for static use, or copy this approximate CSS fallback: */\nbackground: radial-gradient(circle at 30% 30%, ${p.c1}, transparent 60%),\n            radial-gradient(circle at 70% 70%, ${p.c2}, transparent 60%),\n            ${p.c3};`;
}
