import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, forwardRef } from 'react';
import type { ReactNode, Ref } from 'react';
import App from '../App';

vi.mock('framer-motion', () => ({
  motion: {
    div: forwardRef(({ children }: { children?: ReactNode }, ref: Ref<HTMLDivElement>) =>
      createElement('div', { ref }, children),
    ),
  },
  AnimatePresence: ({ children }: { children?: ReactNode }) => children,
}));

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

async function renderAndWait() {
  render(<App />);
  await act(async () => {
    vi.advanceTimersByTime(500);
  });
}

describe('App', () => {
  it('renders header and empty state', async () => {
    await renderAndWait();
    expect(screen.getByText(/观影日记/)).toBeInTheDocument();
    expect(screen.getByText(/还没有日记/)).toBeInTheDocument();
  });

  it('opens create form and creates a diary entry', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderAndWait();

    await user.click(screen.getByText('+ 新建日记'));
    expect(screen.getByText('新建日记')).toBeInTheDocument();

    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');

    const stars = screen.getAllByRole('radio');
    await user.click(stars[4]); // 5 stars

    await user.click(screen.getByText('创建日记'));

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });
    expect(screen.queryByText('还没有日记')).not.toBeInTheDocument();
  });

  it('edits an existing diary entry', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderAndWait();

    await user.click(screen.getByText('+ 新建日记'));
    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');
    await user.click(screen.getAllByRole('radio')[4]);
    await user.click(screen.getByText('创建日记'));

    await waitFor(() => {
      expect(screen.getByText('编辑')).toBeInTheDocument();
    });
    await user.click(screen.getByText('编辑'));
    expect(screen.getByText('编辑日记')).toBeInTheDocument();
    expect(screen.getByLabelText('电影名称 *')).toHaveValue('Inception');
  });

  it('deletes a diary entry', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    window.confirm = () => true;
    await renderAndWait();

    await user.click(screen.getByText('+ 新建日记'));
    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');
    await user.click(screen.getAllByRole('radio')[4]);
    await user.click(screen.getByText('创建日记'));

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });
    await user.click(screen.getByText('删除'));
    await waitFor(() => {
      expect(screen.getByText(/还没有日记/)).toBeInTheDocument();
    });
  });

  it('cancels creation and returns to list', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderAndWait();

    await user.click(screen.getByText('+ 新建日记'));
    expect(screen.getByText('取消')).toBeInTheDocument();
    await user.click(screen.getByText('取消'));
    await waitFor(() => {
      expect(screen.getByText(/还没有日记/)).toBeInTheDocument();
    });
  });
});
