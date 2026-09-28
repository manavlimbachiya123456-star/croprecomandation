import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/dashboard', 'Dashboard'], ['/profile', 'Profile'], ['/soil', 'Soil'], ['/crop-plan', 'Crop Plan'],
  ['/recommendation', 'Recommend'], ['/area-dashboard', 'Area'],
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-green-100 text-green-900' : 'text-stone-700 hover:bg-green-50'}`;

  return (
    <header className="bg-white border-b border-green-100 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-green-800">🌾 AgriSmart</Link>
        {user && <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>}
        {user ? (
          <nav className={`${open ? 'block' : 'hidden'} md:flex absolute md:static top-full left-0 right-0 bg-white md:bg-transparent p-3 md:p-0 border-b md:border-0 items-center gap-1`}>
            {links.map(([to, l]) => <NavLink key={to} to={to} className={cls} onClick={() => setOpen(false)}>{l}</NavLink>)}
            <button className="px-3 py-2 text-red-700" onClick={() => { logout(); nav('/'); }}>Logout</button>
          </nav>
        ) : (
          <nav className="flex gap-2">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
