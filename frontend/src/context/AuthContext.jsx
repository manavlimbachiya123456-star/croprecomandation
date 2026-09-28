import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, loginUser, registerUser } from '../services/authService';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('agri_token'));

  useEffect(() => {
    if (!localStorage.getItem('agri_token')) return;
    getMe().then(setUser).catch(() => localStorage.removeItem('agri_token')).finally(() => setLoading(false));
  }, []);

  const finish = ({ token, user }) => { localStorage.setItem('agri_token', token); setUser(user); };
  const login = async (d) => finish(await loginUser(d));
  const register = async (d) => finish(await registerUser(d));
  const logout = () => { localStorage.removeItem('agri_token'); setUser(null); };

  return <Ctx.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
