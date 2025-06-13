import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../components/home';
import { describe, vi, beforeEach, it, expect } from 'vitest';

describe('Home Lobby', () => {
  const fakeStart = vi.fn();
  const fakeJoin = vi.fn();

  beforeEach(() => {
    fakeStart.mockReset();
    fakeJoin.mockReset();
  });

  it('renders mode buttons', () => {
    render(<Home onStart={fakeStart} onJoin={fakeJoin} />);
    expect(screen.getByText(/Create Room/i)).toBeInTheDocument();
    expect(screen.getByText(/Join Room/i)).toBeInTheDocument();
  });

  it('can switch to Create mode and fetch a word', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ word: 'apple' }) }),
    ) as any;

    render(<Home onStart={fakeStart} onJoin={fakeJoin} />);
    fireEvent.click(screen.getByText(/Create Room/i));
    fireEvent.click(screen.getByText(/Get a Word/i));

    await waitFor(() => {
      expect(screen.getByText(/Your word/i)).toHaveTextContent('apple');
    });
  });
});
