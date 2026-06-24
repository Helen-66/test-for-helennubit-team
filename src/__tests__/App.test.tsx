import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: '' } }),
      }),
    },
  },
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../contexts/AuthContext';
import App from '../App';

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  it('renders header and shows auth form when not authenticated', async () => {
    renderApp();
    expect(await screen.findByText(/观影日记/)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: '登录' })).toBeInTheDocument();
  });

  it('shows email and password fields in auth form', async () => {
    renderApp();
    expect(await screen.findByLabelText('邮箱')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
  });

  it('shows OAuth login buttons', async () => {
    renderApp();
    expect(await screen.findByText('GitHub 登录')).toBeInTheDocument();
    expect(screen.getByText('Google 登录')).toBeInTheDocument();
  });

  it('toggles between login and register modes', async () => {
    const user = userEvent.setup();
    renderApp();
    expect(await screen.findByRole('heading', { name: '登录' })).toBeInTheDocument();

    await user.click(screen.getByText('立即注册'));
    expect(screen.getByRole('heading', { name: '注册' })).toBeInTheDocument();

    await user.click(screen.getByText('立即登录'));
    expect(screen.getByRole('heading', { name: '登录' })).toBeInTheDocument();
  });
});
