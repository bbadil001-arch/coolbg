import { useEffect, useMemo, useRef } from "react";
import { gradientCSSString, buildVectorSVG, drawMesh } from "../lib/generators";

export function GradientSurface({ p, className = "" }) {
  return <div className={className} style={{ background: gradientCSSString(p) }} />;
}

export function VectorSurface({ p, className = "" }) {
  const svg = useMemo(
    () => buildVectorSVG(p.type, p, 400, 300),
    [p.seed, p.type, p.shape, p.density, p.scale, p.noise, p.angle, p.c1, p.c2, p.c3]
  );
  return (
    <div
      className={className}
      style={{ backgroundColor: p.c3, backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundSize: "cover" }}
    />
  );
}

export function CanvasSurface({ p, className = "", animated = false }) {
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!animated || reduceMotion) {
      drawMesh(ctx, w, h, p, 0);
      return;
    }
    const start = performance.now();
    const loop = (now) => {
      drawMesh(ctx, w, h, p, now - start);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [p.seed, p.type, p.c1, p.c2, p.c3, p.density, p.scale, p.noise, animated]);

  return <canvas ref={ref} width={400} height={300} className={className} />;
}

export function Surface({ p, className }) {
  if (p.type === "gradient") return <GradientSurface p={p} className={className} />;
  if (p.type === "mesh") return <CanvasSurface p={p} className={className} animated={false} />;
  if (p.type === "animated") return <CanvasSurface p={p} className={className} animated={true} />;
  return <VectorSurface p={p} className={className} />;
}
