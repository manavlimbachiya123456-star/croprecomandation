import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/recommendationService';
import Loading from '../components/Loading';

const steps = [
  ['/profile', '1. Check your profile'], ['/soil', '2. Enter soil & farm conditions'], ['/crop-plan', '3. Add your crop plan'],
  ['/recommendation', '4. Analyze my land (Stage 1)'], ['/area-analysis', '5. Analyze my area (Stage 2)'],
  ['/final-recommendation', '6. View final recommendations'],
];

export default function Dashboard() {
  const { user } = useAuth();
  const [hist, setHist] = useState(null);
  useEffect(() => { getHistory().then(setHist).catch(() => setHist([])); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-900">Welcome, {user.name}</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {steps.map(([to, l]) => <Link key={to} to={to} className="card hover:border-green-400">{l}</Link>)}
      </div>
      <div className="card">
        <h2 className="font-bold mb-2">Recommendation history</h2>
        {!hist ? <Loading /> : hist.length === 0 ? <p className="text-stone-500 text-sm">No recommendations yet. Start with your soil data.</p> : (
          <ul className="divide-y text-sm">
            {hist.map((h) => (
              <li key={h._id} className="py-2">
                <span className="text-stone-500">{new Date(h.createdAt).toLocaleString()}</span> —{' '}
                {h.finalRecommendations?.length ? `Final: ${h.finalRecommendations.map((r) => r.crop).join(', ')}` : `Stage 1: ${h.stage1.slice(0, 3).map((r) => r.crop).join(', ')}...`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
