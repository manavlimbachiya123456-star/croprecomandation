import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center py-10 space-y-6">
      <h1 className="text-4xl font-extrabold text-green-900">AgriSmart</h1>
      <p className="text-lg text-stone-600 max-w-xl mx-auto">
        Find which crops suit your land, then see how common each one already is in your village.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
        <div className="card"><b>Stage 1</b><p className="text-sm text-stone-600">What can you grow? AI ranks the top 6 crops for your soil and conditions.</p></div>
        <div className="card"><b>Stage 2</b><p className="text-sm text-stone-600">Among those, which are less concentrated in your area? Final top 3 with reasons.</p></div>
      </div>
      <Link to="/register" className="btn">Get Started</Link>
    </div>
  );
}
