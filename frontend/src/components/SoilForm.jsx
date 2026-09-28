import { useState } from 'react';

const SOILS = ['sandy', 'loamy', 'clay', 'black', 'red', 'alluvial', 'other'];
const NUMS = [
  ['N', 'Nitrogen (N)', '0-300'], ['P', 'Phosphorus (P)', '0-300'], ['K', 'Potassium (K)', '0-300'],
  ['ph', 'Soil pH', '0-14'], ['temperature', 'Temperature (°C)', ''], ['humidity', 'Humidity (%)', '0-100'],
  ['rainfall', 'Rainfall (mm)', ''],
];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function Select({ label, value, onChange, opts }) {
  return (
    <div><label className="label">{label}</label>
      <select className="input" value={value} onChange={onChange}>{opts.map((o) => <option key={o} value={o}>{cap(o)}</option>)}</select></div>
  );
}

export default function SoilForm({ initial, onSubmit, saving }) {
  const [f, setF] = useState({
    N: '', P: '', K: '', ph: '', temperature: '', humidity: '', rainfall: '',
    soilType: 'loamy', waterAvailability: 'medium', season: 'kharif', ...initial,
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="card grid gap-4 sm:grid-cols-2">
      {NUMS.map(([k, l, h]) => (
        <div key={k}><label className="label">{l}</label>
          <input className="input" type="number" step="any" required placeholder={h} value={f[k]} onChange={set(k)} /></div>
      ))}
      <Select label="Soil type" value={f.soilType} onChange={set('soilType')} opts={SOILS} />
      <Select label="Water availability" value={f.waterAvailability} onChange={set('waterAvailability')} opts={['low', 'medium', 'high']} />
      <Select label="Season" value={f.season} onChange={set('season')} opts={['kharif', 'rabi', 'zaid']} />
      <div className="sm:col-span-2"><button className="btn w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Soil Data'}</button></div>
    </form>
  );
}
