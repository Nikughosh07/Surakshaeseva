import React, { useState, useEffect } from 'react';
import MapCenter from './components/MapCenter';
import SupplyTracker from './components/SupplyTracker';
import AlertBanner from './components/AlertBanner';
import VolunteerPanel from './components/VolunteerPanel';
import CampLocator from './components/CampLocator';
import AdminDashboard from './components/AdminDashboard';
import AlertBroadcaster from './components/AlertBroadcaster';
import DonationTracker from './components/DonationTracker';
import MissingReport from './components/MissingReport';
import CrowdMap from './components/CrowdMap';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import CampDirector from './components/CampDirector';
import MyMission from './components/MyMission';
import Footer from './components/Footer';
import logo from './logo1.jpeg';
import {
  Map, MapPin, Globe, LayoutDashboard, Users, Package, Megaphone, Shield, Heart, LogOut, Settings
} from 'lucide-react'; 
import axios from 'axios';

const API = 'https://suraksha-e-seva-fn1k.onrender.com/api/coordination';
const AUTH_API = 'https://suraksha-e-seva-fn1k.onrender.com/api/auth';

const TABS = [
  { id: 'my_mission', label: 'My Mission', icon: Shield, roles: ['volunteer'] },
  { id: 'overview', label: 'Overview', icon: Map, roles: ['super_admin', 'admin', 'volunteer'] },
  { id: 'crowd', label: 'Crowd', icon: Globe, roles: ['super_admin', 'admin', 'volunteer'] },
  { id: 'camps', label: 'Camps', icon: Map, roles: ['super_admin', 'admin'] },
  { id: 'volunteers', label: 'Dispatch', icon: Users, roles: ['super_admin', 'admin'] },
  { id: 'supplies', label: 'Logistics', icon: Package, roles: ['super_admin', 'admin'] },
  { id: 'donations', label: 'Donations', icon: Heart, roles: ['super_admin', 'admin'] },
  { id: 'missing', label: 'Missing', icon: MapPin, roles: ['super_admin', 'admin', 'volunteer'] },
  { id: 'alerts', label: 'Alerts', icon: Megaphone, roles: ['super_admin', 'admin'] },
  { id: 'admin', label: 'Admin', icon: LayoutDashboard, roles: ['super_admin', 'admin'] },
  { id: 'camp_director', label: 'Camp Director', icon: Settings, roles: ['super_admin', 'admin'] }
];

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [tab, setTab] = useState('overview');
  const [camps, setCamps] = useState([]);
  const [stats, setStats] = useState(null);

  // Restore session from localStorage JWT
  useEffect(() => {
    const token = localStorage.getItem('drp_token');
    if (!token) {
      setAuthLoading(false);
      return;
    }
    axios.get(`${AUTH_API}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { setUser(res.data.user); })
      .catch(() => { localStorage.removeItem('drp_token'); })
      .finally(() => { setAuthLoading(false); });
  }, []);

  // Fetch data once authenticated
  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/camps`).then(r => setCamps(r.data)).catch(console.error);
    axios.get(`${API}/stats`).then(r => setStats(r.data)).catch(console.error);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('drp_token');
    setUser(null);
  };

  const criticalCount = camps.filter(c =>
    c.priorityScore > 50 || c.inventory?.some(i => i.status === 'Critical')
  ).length;

  // Auth loading spinner
  if (authLoading) {
    return (
      <div className="App bg-slate-900 min-h-screen flex items-center justify-center">
        <div style={{
          width: 36, height: 36,
          border: '3px solid rgba(59,130,246,0.2)',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Show LandingPage or AuthPage if not logged in
  if (!user) {
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }
    return <AuthPage
      onLogin={(u) => {
        setUser(u);
        setTab(u.role === 'volunteer' ? 'my_mission' : 'overview');
      }}
      onBack={() => setShowLanding(true)}
    />;
  }

  // Role label helper
  const roleBadge = (() => {
    if (user.role === 'super_admin') return { label: 'Super Admin', color: 'text-yellow-400 bg-yellow-900/40 border-yellow-700/50' };
    if (user.role === 'admin') return { label: 'Admin', color: 'text-purple-400 bg-purple-900/40 border-purple-700/50' };
    const spec = user.volunteerRole
      ? user.volunteerRole.charAt(0).toUpperCase() + user.volunteerRole.slice(1)
      : 'Volunteer';
    return { label: spec, color: 'text-emerald-400 bg-emerald-900/40 border-emerald-700/50' };
  })();

  return (
    <div className="App bg-slate-900 min-h-screen flex flex-col text-white font-sans">
      <AlertBanner />

      {/* Header */}
      <header className="glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 cursor-pointer" onClick={() => { localStorage.removeItem('drp_token'); setUser(null); setShowLanding(true); }}>
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Suraksha e seva</h1>
              <p className="text-xs text-yellow-400 font-medium">⚠️ SIMULATION MODE — Prototype Only</p>
            </div>
          </a>

          {/* Live status pills + user info */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-3">
              <span className="flex items-center gap-1.5 bg-green-900/40 border border-green-700/50 text-green-400 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                {stats?.totalCamps ?? '...'} Camps Online
              </span>
              <span className="flex items-center gap-1.5 bg-blue-900/40 border border-blue-700/50 text-blue-400 px-3 py-1.5 rounded-full">
                <Users size={11} />
                {stats?.availableVolunteers ?? '...'} Available
              </span>
              {criticalCount > 0 && (
                <span className="flex items-center gap-1.5 bg-red-900/40 border border-red-700/50 text-red-400 px-3 py-1.5 rounded-full animate-pulse">
                  ⚡ {criticalCount} Critical
                </span>
              )}
            </div>

            {/* User badge */}
            <span className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-full font-semibold ${roleBadge.color}`}>
              {user.name.split(' ')[0]} · {roleBadge.label}
            </span>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-700/50 px-3 py-1.5 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-7xl mx-auto px-6 flex gap-1 pb-0 overflow-x-auto overflow-y-hidden">
          {TABS.filter(t => t.roles.includes(user.role)).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all whitespace-nowrap ${tab === id
                ? 'border-blue-500 text-blue-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 flex-grow w-full">

        {/* MY MISSION (Volunteers Only) */}
        {tab === 'my_mission' && <MyMission user={user} />}

        {/* CROWD-SOURCED INFO */}
        {tab === 'crowd' && <CrowdMap user={user} />}

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[420px] rounded-xl overflow-hidden border border-slate-700">
              <MapCenter camps={camps} />
            </div>
            <SupplyTracker camps={camps} />
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Active Camps', value: stats?.totalCamps, color: 'text-blue-400' },
                  { label: 'Volunteers', value: stats?.totalVolunteers, color: 'text-green-400' },
                  { label: 'On Mission', value: stats?.onMissionVolunteers, color: 'text-orange-400' },
                  { label: 'Critical Camps', value: criticalCount, color: 'text-red-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="clay-card p-4 text-center">
                    <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
                    <p className="text-xs text-slate-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CAMPS */}
        {tab === 'camps' && <CampLocator camps={camps} />}

        {/* VOLUNTEERS */}
        {tab === 'volunteers' && <VolunteerPanel />}

        {/* SUPPLIES */}
        {tab === 'supplies' && <SupplyTracker camps={camps} />}

        {/* DONATIONS */}
        {tab === 'donations' && <DonationTracker />}

        {/* MISSING PERSONS REPORT */}
        {tab === 'missing' && <MissingReport user={user} />}

        {/* ALERTS */}
        {tab === 'alerts' && (
          <div className="max-w-2xl mx-auto">
            <AlertBroadcaster />
          </div>
        )}

        {/* ADMIN */}
        {tab === 'admin' && <AdminDashboard stats={stats} camps={camps} />}

        {/* CAMP DIRECTOR */}
        {tab === 'camp_director' && (
          <CampDirector
            camps={camps}
            onCampUpdated={(updatedCamp) => setCamps(camps.map(c => c._id === updatedCamp._id ? updatedCamp : c))}
          />
        )}
      </main>

      <Footer theme="dark" />
    </div>
  );
}

export default App;
