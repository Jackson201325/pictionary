import React, { useState } from 'react';

type HomeProps = {
  onStart: (word: string) => void;
  onJoin: (roomId: string) => void;
};
const Mode = { none: 'none', create: 'create', join: 'join' };

export default function Home({ onStart, onJoin }: HomeProps) {
  const [mode, setMode] = useState<string>(Mode.none);
  const [word, setWord] = useState<string | null>(null);
  const [joinId, setJoinId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchWord = async () => {
    setError(null);
    try {
      const res = await fetch('/api/word');
      const data = await res.json();
      setWord(data.word);
    } catch {
      setError('Failed to fetch word');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-6 text-4xl font-bold">Pictionary</h1>

      {/* Mode selection */}
      {mode === Mode.none && (
        <div className="flex space-x-4">
          <button
            className="py-2 px-6 text-white bg-blue-600 rounded"
            onClick={() => setMode(Mode.create)}
          >
            Create Room
          </button>
          <button
            className="py-2 px-6 text-white bg-yellow-500 rounded"
            onClick={() => setMode(Mode.join)}
          >
            Join Room
          </button>
        </div>
      )}

      {/* Create flow */}
      {mode === Mode.create && (
        <div className="flex flex-col items-center">
          {!word ? (
            <>
              <button className="py-2 px-6 mb-4 text-white bg-blue-600 rounded" onClick={fetchWord}>
                Get a Word
              </button>
              {error && <div className="mb-4 text-red-500">{error}</div>}
            </>
          ) : (
            <>
              <div className="mb-4">
                Your word: <strong>{word}</strong>
              </div>
              <button
                className="py-2 px-6 text-white bg-green-600 rounded"
                onClick={() => onStart(word!)}
              >
                Start Drawing
              </button>
            </>
          )}
        </div>
      )}

      {/* Join flow */}
      {mode === Mode.join && (
        <div className="flex items-center space-x-2">
          <input
            className="py-2 px-4 rounded border"
            placeholder="Enter room ID"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
          />
          <button
            className="py-2 px-4 text-white bg-yellow-500 rounded"
            disabled={!joinId.trim()}
            onClick={() => onJoin(joinId.trim())}
          >
            Join Room
          </button>
        </div>
      )}
    </div>
  );
}
