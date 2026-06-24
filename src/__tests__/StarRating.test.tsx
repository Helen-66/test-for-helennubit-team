import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StarRating from '../components/StarRating';

describe('StarRating', () => {
  it('renders 5 stars', () => {
    render(<StarRating value={0} onChange={() => {}} />);
    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(5);
  });

  it('calls onChange on click', async () => {
    const user = userEvent.setup();
    let selected = 0;
    render(<StarRating value={0} onChange={(v) => { selected = v; }} />);

    await user.click(screen.getByLabelText('3 星'));
    expect(selected).toBe(3);
  });

  it('shows label for selected value', () => {
    render(<StarRating value={4} onChange={() => {}} />);
    expect(screen.getByText('4 / 5')).toBeInTheDocument();
  });

  it('shows 未评分 when value is 0', () => {
    render(<StarRating value={0} onChange={() => {}} />);
    expect(screen.getByText('未评分')).toBeInTheDocument();
  });
});
