import { useCallback, useState } from 'react';
import { type Stroke } from './components/canvas';
import Game from './components/game';
import Home from './components/home';
import useWebSocket from './hooks/useWebSockets';

export default function App() {
  const [word, setWord] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { strokes, send } = useWebSocket(roomId || '');

  const startGame = useCallback((selectedWord: string) => {
    setWord(selectedWord);
    setRoomId(crypto.randomUUID());
  }, []);

  const joinGame = useCallback((id: string) => {
    setRoomId(id);
  }, []);

  const handleStroke = useCallback(
    (stroke: Stroke) => {
      send(stroke);
    },
    [send]
  );

  const resetGame = useCallback(() => {
    setWord(null);
    setRoomId(null);
  }, []);

  if (!roomId) {
    return <Home onStart={startGame} onJoin={joinGame} />;
  }

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
