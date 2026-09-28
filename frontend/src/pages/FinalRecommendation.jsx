import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecommendationCard from '../components/RecommendationCard';
import Loading from '../components/Loading';
import { getLatest } from '../services/recommendationService';
import { DISCLAIMER, NOTE } from '../constants';

export default function FinalRecommendation() {
  const [rec, setRec] = useState(undefined);
  useEffect(() => { getLatest(true).then(setRec).catch(() => setRec(null)); }, []);

  if (rec === undefined) return <Loading />;
  if (!rec) return <div className="card">No final recommendation yet. <Link className="underline" to="/recommendation">Start with Analyze My Land</Link>.</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-green-900">Your Final Crop Recommendations</h1>
      <p className="text-sm text-stone-600">
        Area: <b className="capitalize">{rec.areaAnalysis?.name}</b> · {rec.areaAnalysis?.farmers} farmers · confidence {rec.areaAnalysis?.confidence}. {NOTE}
      </p>
      <div className="grid gap-4 md:grid-cols-3">{rec.finalRecommendations.map((r, i) => <RecommendationCard key={r.crop} rank={i + 1} r={r} />)}</div>
      <p className="text-xs text-stone-500">{DISCLAIMER}</p>
    </div>
  );
}
