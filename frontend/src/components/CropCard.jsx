export default function CropCard({ crop, score, rank }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase text-green-900">{rank ? `${rank}. ` : ''}{crop}</h3>
        <span className="text-green-700 font-semibold">{score}%</span>
      </div>
      <p className="text-sm text-stone-500 mb-2">suitability</p>
      <div className="h-2 rounded bg-stone-100"><div className="h-2 rounded bg-green-600" style={{ width: `${Math.min(score, 100)}%` }} /></div>
    </div>
  );
}
