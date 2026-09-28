import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CropCard from '../components/CropCard';
import Loading from '../components/Loading';
import { analyzeLand, getLatest } from '../services/recommendationService';
import { errMsg } from '../services/api';
import { DISCLAIMER } from '../constants';

export default function Stage1Recommendation() {
  const nav = useNavigate();
  const [crops, setCrops] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { getLatest().then((r) => setCrops(r?.stage1 || [])).catch(() => setCrops([])); }, []);

  const run = async () => {
    setErr(''); setBusy(true);
    try { setCrops((await analyzeLand()).stage1); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-green-900">AI Crop Suitability</h1>
      <p className="text-sm text-stone-600">Stage 1: crops technically suitable for your land, from your soil and conditions.</p>
      <button className="btn" onClick={run} disabled={busy}>{busy ? 'Analyzing...' : 'Analyze My Land'}</button>
      {err && <p className="text-red-700 text-sm">{err} {err.includes('soil') && <Link className="underline" to="/soil">Go to Soil Data</Link>}</p>}
      {busy && <Loading text="Running crop model..." />}
      {crops === null ? <Loading /> : crops.length === 0 ? (
        !busy && <p className="text-stone-500">No analysis yet. Click “Analyze My Land”.</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{crops.map((c, i) => <CropCard key={c.crop} rank={i + 1} {...c} />)}</div>
          <button className="btn" onClick={() => nav('/area-analysis')}>Analyze My Area</button>
        </>
      )}
      <p className="text-xs text-stone-500">{DISCLAIMER}</p>
    </div>
  );
}
