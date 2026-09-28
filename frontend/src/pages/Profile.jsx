import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import { errMsg } from '../services/api';
import { UNITS } from '../constants';

const F = [['name', 'Name'], ['phone', 'Mobile'], ['village', 'Village'], ['taluka', 'Taluka'], ['district', 'District'], ['state', 'State']];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ ...user, landUnit: 'acre' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { const u = await updateProfile(f); setUser(u); setF({ ...u, landUnit: 'acre' }); setEdit(false); }
    catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-green-900">Farmer Profile</h1>
      {edit ? (
        <form onSubmit={save} className="card grid gap-4 sm:grid-cols-2">
          {err && <p className="text-red-700 text-sm sm:col-span-2">{err}</p>}
          {F.map(([k, l]) => <div key={k}><label className="label">{l}</label><input className="input" required value={f[k]} onChange={set(k)} /></div>)}
          <div><label className="label">Land area</label><input className="input" type="number" step="any" required value={f.landArea} onChange={set('landArea')} /></div>
          <div><label className="label">Unit</label><select className="input" value={f.landUnit} onChange={set('landUnit')}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></div>
          <div className="sm:col-span-2 flex gap-2"><button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn-outline" onClick={() => setEdit(false)}>Cancel</button></div>
        </form>
      ) : (
        <div className="card grid gap-2 sm:grid-cols-2 text-sm">
          {F.map(([k, l]) => <div key={k}><span className="text-stone-500">{l}: </span><b>{user[k]}</b></div>)}
          <div><span className="text-stone-500">Land area: </span><b>{user.landArea} acres</b></div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button className="btn-outline" onClick={() => setEdit(true)}>Edit Profile</button>
        <Link to="/soil" className="btn-outline">Add Farm Data</Link>
        <Link to="/recommendation" className="btn">Start Recommendation</Link>
      </div>
    </div>
  );
}
