import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SoilData from './pages/SoilData';
import CropPlan from './pages/CropPlan';
import Stage1Recommendation from './pages/Stage1Recommendation';
import AreaAnalysis from './pages/AreaAnalysis';
import FinalRecommendation from './pages/FinalRecommendation';
import AreaDashboard from './pages/AreaDashboard';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const P = (el) => <Protected>{el}</Protected>;
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={P(<Dashboard />)} />
          <Route path="/profile" element={P(<Profile />)} />
          <Route path="/soil" element={P(<SoilData />)} />
          <Route path="/crop-plan" element={P(<CropPlan />)} />
          <Route path="/recommendation" element={P(<Stage1Recommendation />)} />
          <Route path="/area-analysis" element={P(<AreaAnalysis />)} />
          <Route path="/final-recommendation" element={P(<FinalRecommendation />)} />
          <Route path="/area-dashboard" element={P(<AreaDashboard />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
