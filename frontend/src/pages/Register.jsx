import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';
import { UNITS } from '../constants';

const F = [
  ['name', 'Name'], ['phone', 'Mobile'], ['email', 'Email', 'email'], ['password', 'Password', 'password'],
  ['village', 'Village'], ['taluka', 'Taluka'], ['district', 'District'], ['state', 'State'],
];

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', phone: '', email: '', password: '', village: '', taluka: '', district: '', state: '', landArea: '', landUnit: 'acre' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await register(f); nav('/dashboard'); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl mx-auto grid gap-4 sm:grid-cols-2">
      <h2 className="text-2xl font-bold text-green-900 sm:col-span-2">Farmer Registration</h2>
      {err && <p className="text-red-700 text-sm sm:col-span-2">{err}</p>}
      {F.map(([k, l, t]) => (
        <div key={k}><label className="label">{l}</label><input className="input" type={t || 'text'} required value={f[k]} onChange={set(k)} /></div>
      ))}
      <div><label className="label">Land area</label><input className="input" type="number" step="any" min="0" required value={f.landArea} onChange={set('landArea')} /></div>
      <div><label className="label">Land unit</label>
        <select className="input" value={f.landUnit} onChange={set('landUnit')}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></div>
      <button className="btn sm:col-span-2" disabled={busy}>{busy ? 'Creating account...' : 'Register'}</button>
      <p className="text-sm sm:col-span-2">Already registered? <Link to="/login" className="text-green-800 underline">Login</Link></p>
    </form>
  );
}
