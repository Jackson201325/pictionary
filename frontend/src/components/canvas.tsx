import React, { useRef, useEffect } from 'react';

export type Stroke = { x0: number; y0: number; x1: number; y1: number };

interface CanvasProps {
  strokes: Stroke[];
  onStroke: (stroke: Stroke) => void;
}

export default function Canvas({ strokes, onStroke }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const prevRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((s) => {
      ctx.beginPath();
      ctx.moveTo(s.x0, s.y0);
      ctx.lineTo(s.x1, s.y1);
      ctx.stroke();
    });
  }, [strokes]);

  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.MouseEvent) => {
    prevRef.current = getPos(e);
    drawingRef.current = true;
  };
  const draw = (e: React.MouseEvent) => {
    if (!drawingRef.current || !prevRef.current) return;
    const p = getPos(e);
    const stroke = { x0: prevRef.current.x, y0: prevRef.current.y, x1: p.x, y1: p.y };
    onStroke(stroke);
    prevRef.current = p;
  };
  const end = () => {
    drawingRef.current = false;
    prevRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      role="img"
      aria-label="drawing canvas"
      data-testid="canvas"
      className="w-full h-full border"
      onMouseDown={start}
      onMouseMove={draw}
      onMouseUp={end}
      onMouseLeave={end}
    />
  );
}
