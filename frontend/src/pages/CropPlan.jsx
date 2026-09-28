import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { errMsg } from '../services/api';
import { getCropPlans, saveCropPlan } from '../services/recommendationService';
import { CROPS, UNITS } from '../constants';

export default function CropPlan() {
  const [f, setF] = useState({ currentCrop: '', plannedCrop: '', landArea: '', landUnit: 'acre', season: 'kharif', expectedYield: '' });
  const [plans, setPlans] = useState([]);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const load = () => getCropPlans().then(setPlans).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setOk(false); setBusy(true);
    try { await saveCropPlan(f); setOk(true); load(); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };
  const Crop = ({ k, label }) => (
    <div><label className="label">{label}</label>
      <select className="input" value={f[k]} onChange={set(k)}><option value="">— none —</option>{CROPS.map((c) => <option key={c}>{c}</option>)}</select></div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-green-900">Crop Plan</h1>
      <p className="text-sm text-stone-600">This feeds the village crop statistics. One plan per season (saving again updates it).</p>
      <form onSubmit={submit} className="card grid gap-4 sm:grid-cols-2">
        {err && <p className="text-red-700 text-sm sm:col-span-2">{err}</p>}
        {ok && <p className="text-green-700 text-sm sm:col-span-2">Crop plan saved. <Link className="underline" to="/recommendation">Continue to recommendation →</Link></p>}
        <Crop k="currentCrop" label="Current crop" />
        <Crop k="plannedCrop" label="Planned crop" />
        <div><label className="label">Land area used for crop</label><input className="input" type="number" step="any" min="0" required value={f.landArea} onChange={set('landArea')} /></div>
        <div><label className="label">Unit</label><select className="input" value={f.landUnit} onChange={set('landUnit')}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></div>
        <div><label className="label">Season</label><select className="input" value={f.season} onChange={set('season')}><option value="kharif">Kharif</option><option value="rabi">Rabi</option><option value="zaid">Zaid</option></select></div>
        <div><label className="label">Expected yield (optional, quintal)</label><input className="input" type="number" step="any" min="0" value={f.expectedYield} onChange={set('expectedYield')} /></div>
        <button className="btn sm:col-span-2" disabled={busy}>{busy ? 'Saving...' : 'Save Crop Plan'}</button>
      </form>
      <div className="card"><h2 className="font-bold mb-2">Your saved plans</h2>
        {plans.length === 0 ? <p className="text-sm text-stone-500">No plans yet.</p> : (
          <ul className="text-sm divide-y">{plans.map((p) => <li key={p._id} className="py-2 capitalize">{p.season}: <b>{p.crop}</b> — {p.landArea} acres</li>)}</ul>
        )}
      </div>
    </div>
  );
}
