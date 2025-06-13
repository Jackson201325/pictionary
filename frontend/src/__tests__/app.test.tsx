import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('../components/home', () => ({
  default: ({ onStart, onJoin }: any) => (
    <div>
      <button onClick={() => onStart('banana')}>START</button>
      <button onClick={() => onJoin('ROOM42')}>JOIN</button>
    </div>
  ),
}));

// Stub Game to show props and offer Play Again
vi.mock('../components/game', () => ({
  default: ({ roomId, word, onStroke, onReset }: any) => (
    <div>
      <div>
        GAME {roomId}
        {word}
      </div>
      <button onClick={() => onStroke({ x0: 1, y0: 2, x1: 3, y1: 4 })}>STROKE</button>
      <button onClick={onReset}>RESET</button>
    </div>
  ),
}));

describe('App.tsx', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', { randomUUID: () => 'GEN-UUID' } as any);
  });

  it('renders Home initially and then Game on START', () => {
    render(<App />);
    expect(screen.getByText('START')).toBeInTheDocument();

    fireEvent.click(screen.getByText('START'));
    expect(screen.getByText('GAME GEN-UUIDbanana')).toBeInTheDocument();
  });

  it('renders Game on JOIN with given ID', () => {
    render(<App />);
    fireEvent.click(screen.getByText('JOIN'));
    expect(screen.getByText('GAME ROOM42')).toBeInTheDocument();
  });

  it('opens WebSocket on start', () => {
    const urls: string[] = [];
    class WS {
      constructor(url: string) {
        urls.push(url);
      }
      send() {}
      close() {}
    }
    vi.stubGlobal('WebSocket', WS as any);

    render(<App />);
    fireEvent.click(screen.getByText('START'));
    expect(urls).toContain('ws://localhost:8000/ws/GEN-UUID');
  });

  it('handleStroke sends stroke to socket', () => {
    const sent: string[] = [];
    class WS {
      constructor() {}
      send(data: string) {
        sent.push(data);
      }
      close() {}
    }
    vi.stubGlobal('WebSocket', WS as any);

    render(<App />);
    fireEvent.click(screen.getByText('START'));
    fireEvent.click(screen.getByText('STROKE'));
    expect(sent).toContain(
      JSON.stringify({ type: 'stroke', payload: { x0: 1, y0: 2, x1: 3, y1: 4 } }),
    );
  });

  it('resetGame closes socket and returns to Home on RESET', () => {
    render(<App />);
    fireEvent.click(screen.getByText('START'));
    expect(screen.queryByText('START')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('RESET'));
    expect(screen.getByText('START')).toBeInTheDocument();
  });
});
