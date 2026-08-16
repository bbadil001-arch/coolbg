// URL hash encode/decode for shareable background links, e.g.
// coolbg.com/#type=gradient&c1=7c5cfc&c2=ec4899&angle=45
export function encodeStateToHash(p) {
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
    if (!params.get("type")) return null;
    return {
      id: "shared-" + Math.random().toString(36).slice(2, 9),
      type: params.get("type"),
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
