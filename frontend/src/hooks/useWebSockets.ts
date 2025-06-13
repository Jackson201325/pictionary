import { useEffect, useState, useRef, useCallback } from 'react';

export default function useWebSocket(roomId: string) {
  const [strokes, setStrokes] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const base = import.meta.env.VITE_WS_URL as string;
    const ws = new WebSocket(`${base}/${roomId}`);

    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setStrokes((prev) => [...prev, msg.payload]);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [roomId]);

  const send = useCallback((payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stroke', payload }));
    }
  }, []);

  return { strokes, send };
}
