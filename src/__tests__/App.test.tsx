import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  it('renders header and empty state', () => {
    render(<App />);
    expect(screen.getByText(/观影日记/)).toBeInTheDocument();
    expect(screen.getByText(/你的电影收藏是空的/)).toBeInTheDocument();
  });

  it('opens create form and creates a diary entry', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('+ 新建日记'));
    expect(screen.getByText('新建日记')).toBeInTheDocument();

    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');

    const stars = screen.getAllByRole('radio');
    await user.click(stars[4]); // 5 stars

    await user.click(screen.getByText('创建日记'));

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.queryByText(/你的电影收藏是空的/)).not.toBeInTheDocument();
  });

  it('edits an existing diary entry', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('+ 新建日记'));
    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');
    await user.click(screen.getAllByRole('radio')[4]);
    await user.click(screen.getByText('创建日记'));

    await user.click(screen.getByText('编辑'));
    expect(screen.getByText('编辑日记')).toBeInTheDocument();
    expect(screen.getByLabelText('电影名称 *')).toHaveValue('Inception');
  });

  it('deletes a diary entry', async () => {
    const user = userEvent.setup();
    window.confirm = () => true;
    render(<App />);

    await user.click(screen.getByText('+ 新建日记'));
    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');
    await user.click(screen.getAllByRole('radio')[4]);
    await user.click(screen.getByText('创建日记'));

    expect(screen.getByText('Inception')).toBeInTheDocument();
    await user.click(screen.getByText('删除'));
    expect(screen.getByText(/你的电影收藏是空的/)).toBeInTheDocument();
  });

  it('cancels creation and returns to collection', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('+ 新建日记'));
    await user.click(screen.getByText('取消'));
    expect(screen.getByText(/你的电影收藏是空的/)).toBeInTheDocument();
  });
});
