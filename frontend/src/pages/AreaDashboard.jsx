import { useEffect, useState } from 'react';
import AreaChart from '../components/AreaChart';
import Loading from '../components/Loading';
import { getAreaSummary } from '../services/recommendationService';
import { errMsg } from '../services/api';
import { NOTE } from '../constants';

export default function AreaDashboard() {
  const [a, setA] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { getAreaSummary().then(setA).catch((x) => setErr(errMsg(x))); }, []);

  if (err) return <p className="text-red-700">{err}</p>;
  if (!a) return <Loading />;
  const d = a.distribution;
  const most = d.slice(0, 3), least = [...d].reverse().slice(0, 3);
  const List = ({ title, items }) => (
    <div className="card"><h3 className="font-bold mb-1">{title}</h3>
      {items.length ? <ul className="text-sm">{items.map((c) => <li key={c.crop}>{c.crop} — {c.percentage}%</li>)}</ul> : <p className="text-sm text-stone-500">No data</p>}</div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-green-900">Area Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card"><p className="text-xs text-stone-500">Area ({a.level})</p><b className="capitalize">{a.name}</b></div>
        <div className="card"><p className="text-xs text-stone-500">Total farmers</p><b>{a.farmers}</b></div>
        <div className="card"><p className="text-xs text-stone-500">Total land</p><b>{a.totalLand} acres</b></div>
      </div>
      {d.length === 0 ? <div className="card text-stone-500">No crop plans reported in this area yet.</div> : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card"><h3 className="font-bold">Crop distribution</h3><AreaChart data={d} type="pie" /></div>
            <div className="card"><h3 className="font-bold">Crop-wise land (acres)</h3><AreaChart data={d} type="bar" dataKey="landArea" unit=" ac" /></div>
            <div className="card"><h3 className="font-bold">Crop-wise farmer count</h3><AreaChart data={d} type="bar" dataKey="farmerCount" unit="" /></div>
            <div className="grid gap-4"><List title="Most cultivated crops" items={most} /><List title="Least cultivated crops" items={least} /></div>
          </div>
          <p className="text-xs text-stone-500">Cultivation share is descriptive only — it does not mean a crop is better or worse. {NOTE}</p>
        </>
      )}
    </div>
  );
}
