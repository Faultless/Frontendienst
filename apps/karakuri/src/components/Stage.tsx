/**
 * The turtle's canvas stage. Pure drawing: paints the segments the domain
 * engine produced plus the turtle itself. Origin at center, y down.
 */

import { useEffect, useRef, useState } from "react";
import type { Segment, TurtleState } from "../domain/turtle";

const GRID_STEP = 40;

function draw(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  segments: readonly Segment[],
  turtle: TurtleState,
): void {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#0c0a09"; // stone-950
  ctx.fillRect(0, 0, width, height);
  ctx.translate(width / 2, height / 2);

  // Faint grid + center cross.
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#1c1917";
  ctx.beginPath();
  for (let x = GRID_STEP; x < width / 2; x += GRID_STEP) {
    ctx.moveTo(x, -height / 2);
    ctx.lineTo(x, height / 2);
    ctx.moveTo(-x, -height / 2);
    ctx.lineTo(-x, height / 2);
  }
  for (let y = GRID_STEP; y < height / 2; y += GRID_STEP) {
    ctx.moveTo(-width / 2, y);
    ctx.lineTo(width / 2, y);
    ctx.moveTo(-width / 2, -y);
    ctx.lineTo(width / 2, -y);
  }
  ctx.stroke();
  ctx.strokeStyle = "#292524";
  ctx.beginPath();
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(0, height / 2);
  ctx.moveTo(-width / 2, 0);
  ctx.lineTo(width / 2, 0);
  ctx.stroke();

  // The drawing.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const s of segments) {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.stroke();
  }

  // The turtle: a kite pointing along its heading.
  const rad = (turtle.headingDeg * Math.PI) / 180;
  ctx.save();
  ctx.translate(turtle.x, turtle.y);
  ctx.rotate(rad);
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(8, 8);
  ctx.lineTo(0, 4);
  ctx.lineTo(-8, 8);
  ctx.closePath();
  ctx.fillStyle = turtle.penDown ? turtle.color : "#57534e";
  ctx.fill();
  ctx.strokeStyle = "#0c0a09";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

export function Stage({
  segments,
  turtle,
}: {
  readonly segments: readonly Segment[];
  readonly turtle: TurtleState;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w === 0 || size.h === 0) return;
    draw(canvas, size.w, size.h, segments, turtle);
  }, [segments, turtle, size]);

  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" data-testid="stage" />
      <span className="absolute right-2 top-1.5 text-[10px] uppercase tracking-widest text-stone-600">
        stage
      </span>
    </div>
  );
}
