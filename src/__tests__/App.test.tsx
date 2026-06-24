import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  it('renders header and empty state', async () => {
    render(<App />);
    expect(screen.getByText(/观影日记/)).toBeInTheDocument();
    expect(await screen.findByText(/还没有日记/)).toBeInTheDocument();
  });

  it('opens create form and creates a diary entry', async () => {
    const user = userEvent.setup();
    render(<App />);

    const newBtn = await screen.findByText('+ 新建日记');
    await user.click(newBtn);

    expect(await screen.findByText('新建日记', { selector: 'h2' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');

    const stars = screen.getAllByRole('radio');
    await user.click(stars[4]); // 5 stars

    await user.click(screen.getByText('创建日记'));

    expect(await screen.findByText('Inception')).toBeInTheDocument();
    expect(screen.queryByText('还没有日记')).not.toBeInTheDocument();
  });

  it('edits an existing diary entry', async () => {
    const user = userEvent.setup();
    render(<App />);

    const newBtn = await screen.findByText('+ 新建日记');
    await user.click(newBtn);
    await screen.findByLabelText('电影名称 *');
    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');
    await user.click(screen.getAllByRole('radio')[4]);
    await user.click(screen.getByText('创建日记'));

    const editBtn = await screen.findByText('编辑');
    await user.click(editBtn);
    expect(await screen.findByText('编辑日记')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText('电影名称 *')).toHaveValue('Inception');
    });
  });

  it('deletes a diary entry', async () => {
    const user = userEvent.setup();
    window.confirm = () => true;
    render(<App />);

    const newBtn = await screen.findByText('+ 新建日记');
    await user.click(newBtn);
    await screen.findByLabelText('电影名称 *');
    await user.type(screen.getByLabelText('电影名称 *'), 'Inception');
    await user.click(screen.getAllByRole('radio')[4]);
    await user.click(screen.getByText('创建日记'));

    expect(await screen.findByText('Inception')).toBeInTheDocument();
    await user.click(screen.getByText('删除'));
    expect(await screen.findByText(/还没有日记/)).toBeInTheDocument();
  });

  it('cancels creation and returns to list', async () => {
    const user = userEvent.setup();
    render(<App />);

    const newBtn = await screen.findByText('+ 新建日记');
    await user.click(newBtn);

    const cancelBtn = await screen.findByText('取消');
    await user.click(cancelBtn);
    expect(await screen.findByText(/还没有日记/)).toBeInTheDocument();
  });
});
