import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'register';

export default function AuthForm() {
  const { signInWithEmail, signUpWithEmail, signInWithProvider } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result =
      mode === 'login'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);

    if (result.error) {
      setError(result.error.message);
    } else if (mode === 'register') {
      setMessage('注册成功！请检查邮箱完成验证。');
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    setError('');
    const { error: err } = await signInWithProvider(provider);
    if (err) setError(err.message);
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>{mode === 'login' ? '登录' : '注册'}</h2>

        <div className="auth-oauth">
          <button
            type="button"
            className="btn btn--oauth"
            onClick={() => handleOAuth('github')}
          >
            GitHub 登录
          </button>
          <button
            type="button"
            className="btn btn--oauth"
            onClick={() => handleOAuth('google')}
          >
            Google 登录
          </button>
        </div>

        <div className="auth-divider">
          <span>或使用邮箱</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="auth-email">邮箱</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">密码</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="至少6位"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button className="btn btn--primary auth-submit" type="submit" disabled={loading}>
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? '还没有账号？' : '已有账号？'}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setMessage('');
            }}
          >
            {mode === 'login' ? '立即注册' : '立即登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
