import React, { useState } from 'react';
import Canvas, { type Stroke } from './canvas';

type GameProps = {
  roomId: string;
  word: string;
  strokes: Stroke[];
  onStroke: (stroke: Stroke) => void;
  onReset: () => void;
};

export default function Game({ roomId, word, strokes, onStroke, onReset }: GameProps) {
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(guess.trim().toLowerCase() === word.toLowerCase() ? 'correct' : 'wrong');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="flex flex-col p-4 h-screen">
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-sm">Room ID: {roomId}</span>
        <button onClick={handleCopy} className="text-blue-500 underline">
          Copy
        </button>
      </div>
      <div className="flex-1">
        <Canvas strokes={strokes} onStroke={onStroke} />
      </div>
      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          className="flex-1 py-1 px-2 rounded border"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Your guess"
        />
        <button type="submit" className="py-2 px-4 ml-2 text-white bg-blue-500 rounded">
          Submit
        </button>
      </form>
      {result && (
        <div className="mt-4 text-center">
          {result === 'correct' ? (
            <div className="text-green-600">Correct! 🎉</div>
          ) : (
            <div className="text-red-600">Wrong, try again.</div>
          )}
          <button onClick={onReset} className="py-2 px-4 mt-2 text-white bg-gray-500 rounded">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
