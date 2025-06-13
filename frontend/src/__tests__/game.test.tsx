import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Game from '../components/game';

describe('Game', () => {
  it('displays roomId and copies it', () => {
    const stubClipboard = { writeText: vi.fn() };
    Object.assign(navigator, { clipboard: stubClipboard });

    render(<Game roomId="ABC" word="cat" strokes={[]} onStroke={() => {}} onReset={() => {}} />);
    fireEvent.click(screen.getByText(/Copy/i));
    expect(stubClipboard.writeText).toHaveBeenCalledWith('ABC');
  });

  it('shows correct/wrong feedback and reset', () => {
    const onReset = vi.fn();
    render(<Game roomId="R" word="dog" strokes={[]} onStroke={() => {}} onReset={onReset} />);

    // Wrong guess
    fireEvent.change(screen.getByPlaceholderText(/Your guess/i), { target: { value: 'cat' } });
    fireEvent.click(screen.getByText(/Submit/i));
    expect(screen.getByText(/Wrong, try again/i)).toBeInTheDocument();

    // Correct guess
    fireEvent.change(screen.getByPlaceholderText(/Your guess/i), { target: { value: 'dog' } });
    fireEvent.click(screen.getByText(/Submit/i));
    expect(screen.getByText(/Correct! 🎉/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Play Again/i));
    expect(onReset).toHaveBeenCalled();
  });
});
