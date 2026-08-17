import { pollinationsUrl, AI_PREVIEW_SIZE } from "./aiGenerate";

// URL hash encode/decode for shareable background links, e.g.
// coolbg.com/#type=gradient&c1=7c5cfc&c2=ec4899&angle=45
// AI-generated cards encode the prompt + seed instead of colors, since
// the same prompt+seed reproduces (close to) the same Pollinations image.
export function encodeStateToHash(p) {
  if (p.type === "ai-image") {
    const params = new URLSearchParams({ type: p.type, prompt: p.prompt, seed: p.seed });
    return params.toString();
  }
  const params = new URLSearchParams({
    type: p.type,
    c1: p.c1.replace("#", ""),
    c2: p.c2.replace("#", ""),
    c3: p.c3.replace("#", ""),
    angle: p.angle,
    density: p.density,
    scale: p.scale,
    noise: p.noise,
    shape: p.shape,
    seed: p.seed,
  });
  return params.toString();
}

export function decodeHashToState() {
  if (typeof window === "undefined") return null;
  if (!window.location.hash || window.location.hash.length < 2) return null;
  try {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const type = params.get("type");
    if (!type) return null;

    if (type === "ai-image") {
      const prompt = params.get("prompt");
      const seed = Number(params.get("seed")) || 1;
      if (!prompt) return null;
      return {
        id: "shared-" + Math.random().toString(36).slice(2, 9),
        type,
        prompt,
        seed,
        url: pollinationsUrl(prompt, { ...AI_PREVIEW_SIZE, seed }),
      };
    }

    return {
      id: "shared-" + Math.random().toString(36).slice(2, 9),
      type,
      c1: "#" + params.get("c1"),
      c2: "#" + params.get("c2"),
      c3: "#" + params.get("c3"),
      angle: Number(params.get("angle")) || 0,
      density: Number(params.get("density")) || 10,
      scale: Number(params.get("scale")) || 1,
      noise: Number(params.get("noise")) || 0,
      shape: params.get("shape") || "circles",
      seed: Number(params.get("seed")) || 1,
    };
  } catch {
    return null;
  }
}
