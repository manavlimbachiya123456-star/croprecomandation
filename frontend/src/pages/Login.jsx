import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await login(f); nav('/dashboard'); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-green-900">Login</h2>
      {err && <p className="text-red-700 text-sm">{err}</p>}
      <div><label className="label">Email</label><input className="input" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div><label className="label">Password</label><input className="input" type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
      <button className="btn w-full" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
      <p className="text-sm">New here? <Link to="/register" className="text-green-800 underline">Register</Link></p>
    </form>
  );
}
