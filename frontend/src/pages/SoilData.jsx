import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoilForm from '../components/SoilForm';
import Loading from '../components/Loading';
import { getLatestSoil, saveSoil } from '../services/recommendationService';
import { errMsg } from '../services/api';

export default function SoilData() {
  const nav = useNavigate();
  const [initial, setInitial] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { getLatestSoil().then(setInitial).catch(() => {}).finally(() => setReady(true)); }, []);

  const submit = async (f) => {
    setErr(''); setBusy(true);
    try { await saveSoil(f); nav('/crop-plan'); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  if (!ready) return <Loading />;
  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <h1 className="text-2xl font-bold text-green-900">Soil & Farm Conditions</h1>
      <p className="text-sm text-stone-600">Enter values from your soil health card or local measurements.</p>
      {err && <p className="text-red-700 text-sm">{err}</p>}
      <SoilForm initial={initial || undefined} onSubmit={submit} saving={busy} />
    </div>
  );
}
