import { useCallback, useEffect, useState } from 'react';
import { type Stroke } from './components/canvas';
import Game from './components/game';
import Home from './components/home';

export default function App() {
  const [word, setWord] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  const startGame = useCallback((selectedWord: string) => {
    const newRoomId = crypto.randomUUID();
    setWord(selectedWord);
    setRoomId(newRoomId);
  }, []);

  const joinGame = useCallback((id: string) => {
    setRoomId(id);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'stroke') {
        setStrokes((prev) => [...prev, data.payload]);
      }
    };
    setSocket(ws);
    return () => {
      ws.close();
      setStrokes([]);
    };
  }, [roomId]);

  const handleStroke = useCallback(
    (stroke: Stroke) => {
      setStrokes((prev) => [...prev, stroke]);
      socket?.send(JSON.stringify({ type: 'stroke', payload: stroke }));
    },
    [socket],
  );

  const resetGame = useCallback(() => {
    socket?.close();
    setWord(null);
    setRoomId(null);
    setSocket(null);
    setStrokes([]);
  }, [socket]);

  if (!roomId) return <Home onStart={startGame} onJoin={joinGame} />;

  return (
    <Game
      roomId={roomId}
      word={word ?? ''}
      strokes={strokes}
      onStroke={handleStroke}
      onReset={resetGame}
    />
  );
}
