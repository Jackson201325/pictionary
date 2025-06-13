// src/hooks/useWebSockets.ts
import { useEffect, useState, useRef, useCallback } from 'react'

export type Stroke = { x0: number; y0: number; x1: number; y1: number }

export default function useWebSocket(roomId: string) {
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!roomId) return

    const base = import.meta.env.VITE_WS_URL as string
    const ws = new WebSocket(`${base}/${roomId}`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'stroke') {
        setStrokes((prev) => [...prev, msg.payload])
      }
    }

    return () => {
      ws.close()
      wsRef.current = null
      setStrokes([]) // reset when leaving room
    }
  }, [roomId])

  const send = useCallback((payload: Stroke) => {
    // 1) render locally immediately
    setStrokes((prev) => [...prev, payload])

    // 2) then broadcast to peers
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stroke', payload }))
    }
  }, [])

  return { strokes, send }
}
