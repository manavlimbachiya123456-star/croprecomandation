import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AreaChart from '../components/AreaChart';
import Loading from '../components/Loading';
import { generateFinal, getAreaSummary } from '../services/recommendationService';
import { errMsg } from '../services/api';
import { NOTE } from '../constants';

const badge = { Low: 'bg-red-100 text-red-800', Medium: 'bg-yellow-100 text-yellow-800', High: 'bg-green-100 text-green-800' };

export default function AreaAnalysis() {
  const nav = useNavigate();
  const [a, setA] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { getAreaSummary().then(setA).catch((x) => setErr(errMsg(x))); }, []);

  const run = async () => {
    setErr(''); setBusy(true);
    try { await generateFinal(); nav('/final-recommendation'); } catch (x) { setErr(errMsg(x)); setBusy(false); }
  };

  if (!a && !err) return <Loading />;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-green-900">Area Analysis</h1>
      {a && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="card"><p className="text-xs text-stone-500">Location ({a.level})</p><b className="capitalize">{a.name}</b></div>
            <div className="card"><p className="text-xs text-stone-500">Farmers contributing</p><b>{a.farmers}</b></div>
            <div className="card"><p className="text-xs text-stone-500">Total reported land</p><b>{a.totalLand} acres</b></div>
            <div className="card"><p className="text-xs text-stone-500">Data confidence</p><span className={`px-2 py-0.5 rounded text-sm font-semibold ${badge[a.confidence]}`}>{a.confidence}</span></div>
          </div>
          <div className="card"><h2 className="font-bold">Crop distribution</h2><AreaChart data={a.distribution} type="bar" dataKey="percentage" unit="%" /></div>
          <p className="text-xs text-stone-500">{NOTE}</p>
          {a.farmers === 0 && <p className="text-sm text-stone-600">No area data yet — add your <Link className="underline" to="/crop-plan">crop plan</Link> to start the statistics.</p>}
        </>
      )}
      {err && <p className="text-red-700 text-sm">{err}</p>}
      <button className="btn" onClick={run} disabled={busy}>{busy ? 'Calculating...' : 'Get Final Recommendations'}</button>
    </div>
  );
}
