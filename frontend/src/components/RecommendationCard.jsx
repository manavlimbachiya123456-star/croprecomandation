const Row = ({ k, v, bold }) => (
  <div className="flex justify-between text-sm py-1"><span className="text-stone-500">{k}</span><span className={bold ? 'font-bold text-green-800' : 'font-medium'}>{v}</span></div>
);

export default function RecommendationCard({ rank, r }) {
  const adj = r.area_adjustment > 0 ? `+${r.area_adjustment}` : `${r.area_adjustment}`;
  return (
    <div className="card">
      <h3 className="text-lg font-bold uppercase text-green-900 mb-2">{rank}. {r.crop}</h3>
      <Row k="Stage 1 suitability" v={`${r.stage1_score}/100`} />
      <Row k="Area share" v={`${r.area_percentage}%`} />
      <Row k="Area status" v={r.area_status} />
      <Row k="Area adjustment" v={adj} />
      <Row k="Final score" v={r.final_score} bold />
      <p className="mt-3 text-sm text-stone-700 bg-green-50 rounded-lg p-3">{r.reason}</p>
    </div>
  );
}
