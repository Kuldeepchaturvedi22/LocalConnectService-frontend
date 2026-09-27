import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('9999999999');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(identifier.trim(), password);
    } catch (err) {
      setError(err.message || 'Login नहीं हो पाया।');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="brand-panel">
        <div className="brand-mark">LC</div>
        <h1>LocalConnectService</h1>
        <p>Trusted Local Support for Every Brand</p>
        <div className="network-art" aria-hidden="true"><span /><span /><span /><span /></div>
        <p className="brand-copy">एक सुरक्षित portal से enquiries, operations, company और hierarchy manage करें।</p>
      </section>
      <section className="login-side">
        <form className="login-card" onSubmit={submit}>
          <p className="eyebrow">SECURE PORTAL</p>
          <h2>Welcome Back</h2>
          <p className="muted">अपनी registered ID से sign in करें।</p>
          <label htmlFor="identifier">Mobile Number, Email or User ID</label>
          <input id="identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete="username" required />
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
            <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          <div className="login-options"><label className="check"><input type="checkbox" /> Remember me</label><button type="button" className="link-button">Forgot Password?</button></div>
          {error && <div className="error" role="alert">⚠ {error}</div>}
          <button className="primary wide" disabled={busy}>{busy ? 'Signing in…' : 'Secure Login'}</button>
          <button className="secondary wide" type="button">Login with OTP</button>
          <p className="demo-note">Demo: 9999999999 / admin123</p>
        </form>
      </section>
    </main>
  );
}
