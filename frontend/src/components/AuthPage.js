import React, { useState } from 'react';
import {
    UserPlus, LogIn, Shield, Stethoscope, UtensilsCrossed,
    Car, HardHat, Languages, ChevronRight, AlertTriangle,
    Eye, EyeOff, KeyRound, ArrowLeft, HeartPulse, MapPin, Package
} from 'lucide-react';
import axios from 'axios';
import Footer from './Footer';
import logo from '../logo1.jpeg';

const API = 'https://suraksha-e-seva-fn1k.onrender.com/api/auth';

const VOLUNTEER_ROLES = [
    { id: 'medical', label: 'Medical', icon: Stethoscope, color: 'text-red-400', borderActive: 'border-red-400', bgActive: 'bg-red-400/20' },
    { id: 'cooking', label: 'Cooking', icon: UtensilsCrossed, color: 'text-amber-400', borderActive: 'border-amber-400', bgActive: 'bg-amber-400/20' },
    { id: 'driving', label: 'Driving', icon: Car, color: 'text-blue-400', borderActive: 'border-blue-400', bgActive: 'bg-blue-400/20' },
    { id: 'construction', label: 'Construction', icon: HardHat, color: 'text-emerald-400', borderActive: 'border-emerald-400', bgActive: 'bg-emerald-400/20' },
    { id: 'translation', label: 'Translation', icon: Languages, color: 'text-purple-400', borderActive: 'border-purple-400', bgActive: 'bg-purple-400/20' },
];

export default function AuthPage({ onLogin, onBack }) {
    const [mode, setMode] = useState('register'); // 'register' | 'login' | 'super_admin'
    const [role, setRole] = useState('volunteer'); // 'volunteer' | 'admin'
    const [volunteerRole, setVolunteerRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '', superAdminKey: ''
    });

    const set = (key) => (e) => {
        setForm(prev => ({ ...prev, [key]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const { data } = await axios.post(`${API}/login`, {
                    email: form.email,
                    password: form.password
                });
                localStorage.setItem('drp_token', data.token);
                onLogin(data.user);
            } else if (mode === 'super_admin') {
                const { data } = await axios.post(`${API}/register`, {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: 'super_admin',
                    superAdminKey: form.superAdminKey,
                    phone: form.phone
                });
                localStorage.setItem('drp_token', data.token);
                onLogin(data.user);
            } else {
                if (role === 'volunteer' && !volunteerRole) {
                    setError('Please select your volunteer specialty');
                    setLoading(false);
                    return;
                }
                const { data } = await axios.post(`${API}/register`, {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role,
                    volunteerRole: role === 'volunteer' ? volunteerRole : undefined,
                    phone: form.phone
                });
                localStorage.setItem('drp_token', data.token);
                onLogin(data.user);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium";

    return (
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 font-sans overflow-x-hidden relative">

            {/* Split Screen Layout */}
            <div className="flex-grow flex w-full flex-col lg:flex-row relative z-10">

                {/* ── LEFT PANE: Visuals & Graphics ── */}
                <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-center p-12 overflow-hidden border-r border-slate-800/80 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20">
                    {/* Deep dynamic background */}
                    <div className="absolute inset-0 bg-slate-900"></div>
                    <img
                        src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=2070"
                        alt="Hero Graphics"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900/90 to-indigo-950/80 z-10 mix-blend-multiply"></div>

                    {/* Animated Geometric Blobs */}
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse z-10 mix-blend-screen pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-600/20 rounded-full blur-[100px] animate-pulse z-10 mix-blend-screen pointer-events-none" style={{ animationDelay: '2s' }}></div>

                    {/* Floating Tech Badges */}
                    <div className="absolute top-[20%] right-[15%] w-16 h-16 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center text-blue-400 z-20 animate-[float_6s_ease-in-out_infinite] shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <MapPin size={28} />
                    </div>
                    <div className="absolute bottom-[25%] left-[10%] w-14 h-14 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center text-orange-400 z-20 animate-[float_5s_ease-in-out_infinite_reverse] shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                        <HeartPulse size={24} />
                    </div>
                    <div className="absolute bottom-[10%] right-[25%] w-12 h-12 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md flex items-center justify-center text-emerald-400 z-20 animate-[float_7s_ease-in-out_infinite] shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <Package size={20} />
                    </div>

                    <div className="relative z-30 max-w-lg mx-auto text-left w-full pl-8">
                        <img src={logo} alt="Logo" className="w-24 h-24 object-cover rounded-[1.5rem] shadow-2xl mb-10 border-2 border-white/10" />

                        <h1 className="text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            Coordinate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Response.</span><br />
                            Empower <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Action.</span>
                        </h1>

                        <p className="text-lg text-slate-400 leading-relaxed font-medium mb-10 max-w-md">
                            Join the state's central response network. Connect volunteers, manage relief camps, and direct critical supply lines where they are needed most.
                        </p>

                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-widest">
                            <span className="w-12 h-[2px] bg-slate-700"></span>
                            Suraksha e Seva Protocol
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANE: Auth Form ── */}
                <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[linear-gradient(145deg,#0b1120_0%,#0f172a_100%)] overflow-hidden">

                    {/* subtle form blobs */}
                    <div className="absolute top-[20%] right-[0%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none"></div>
                    <div className="absolute bottom-[0%] left-[0%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                    {onBack && (
                        <button
                            onClick={onBack}
                            className="absolute top-6 left-6 z-40 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold text-sm bg-slate-800/40 px-4 py-2 rounded-xl backdrop-blur-md border border-slate-700/50 hover:bg-slate-700/50"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    )}

                    <div className="w-full max-w-[440px] relative z-30 animate-[slideUp_0.5s_ease-out_forwards]">

                        {/* Mobile Header (Hidden on Desktop) */}
                        <div className="lg:hidden text-center mb-10">
                            <img src={logo} alt="Logo" className="w-[72px] h-[72px] object-cover rounded-2xl mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.5)] mb-6 border border-white/10" />
                            <h2 className="text-2xl font-black text-white tracking-tight">Suraksha e seva</h2>
                            <p className="text-sm text-slate-400 mt-2 font-medium">Authentication Portal</p>
                        </div>

                        {/* Mode Controller Tabs */}
                        <div className="flex gap-2 p-1.5 rounded-[1rem] bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8 shadow-inner">
                            <button
                                onClick={() => { setMode('register'); setError(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'register' ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}
                            >
                                <UserPlus size={16} /> Register
                            </button>
                            <button
                                onClick={() => { setMode('login'); setError(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}
                            >
                                <LogIn size={16} /> Sign In
                            </button>
                        </div>

                        {/* Main Interaction Card */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-7 sm:p-8 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group">

                            {/* Glass reflection line */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                {mode === 'register' && (
                                    <div className="animate-[fadeIn_0.3s_ease-out]">
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Participation Role</label>
                                        <div className="flex gap-3 mb-6">
                                            <button
                                                type="button"
                                                onClick={() => setRole('volunteer')}
                                                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'volunteer' ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}
                                            >
                                                <UserPlus size={22} className={role === 'volunteer' ? 'text-blue-400' : ''} />
                                                <span className="font-bold text-sm">Volunteer</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRole('admin')}
                                                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'admin' ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}
                                            >
                                                <Shield size={22} className={role === 'admin' ? 'text-indigo-400' : ''} />
                                                <span className="font-bold text-sm">Admin</span>
                                            </button>
                                        </div>

                                        {role === 'volunteer' && (
                                            <div className="mb-6 animate-[slideDown_0.3s_ease-out]">
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Field Specialty</label>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {VOLUNTEER_ROLES.map(vr => {
                                                        const Icon = vr.icon;
                                                        const sel = volunteerRole === vr.id;
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={vr.id}
                                                                onClick={() => setVolunteerRole(vr.id)}
                                                                title={vr.label}
                                                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${sel ? `${vr.borderActive} ${vr.bgActive}` : 'border-slate-700 bg-slate-800/50 opacity-60 hover:opacity-100'}`}
                                                            >
                                                                <Icon size={20} className={vr.color} />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <input className={inputClass} placeholder="Full Name" value={form.name} onChange={set('name')} required />
                                            <input className={inputClass} placeholder="Email Address" type="email" value={form.email} onChange={set('email')} required />
                                            <div className="relative">
                                                <input className={inputClass} placeholder="Password (min 6 chars)" type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} minLength={6} required />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <input className={inputClass} placeholder="Phone Number (Optional)" value={form.phone} onChange={set('phone')} />
                                        </div>
                                    </div>
                                )}

                                {mode === 'login' && (
                                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                                        <div className="mb-2">
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                            <input className={inputClass} placeholder="name@domain.com" type="email" value={form.email} onChange={set('email')} required />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2 px-1">
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                            </div>
                                            <div className="relative">
                                                <input className={inputClass} placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} required />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === 'super_admin' && (
                                    <div className="space-y-3 animate-[fadeIn_0.3s_ease-out]">
                                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200/90 rounded-xl p-3 flex items-start gap-3 text-xs font-semibold mb-4 leading-relaxed">
                                            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                            <p>Super Admin registration requires high-level clearance. An authorized secret key is mandatory to proceed.</p>
                                        </div>
                                        <input className={inputClass} placeholder="Full Name" value={form.name} onChange={set('name')} required />
                                        <input className={inputClass} placeholder="Email Address" type="email" value={form.email} onChange={set('email')} required />
                                        <div className="relative">
                                            <input className={inputClass} placeholder="Password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} minLength={6} required />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <input className={inputClass} placeholder="Phone Number" value={form.phone} onChange={set('phone')} />
                                        <div className="relative mt-2">
                                            <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                                            <input className={`${inputClass} pl-12 text-amber-50`} placeholder="Super Admin Secret Key" type="password" value={form.superAdminKey} onChange={set('superAdminKey')} required />
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold p-3 rounded-xl animate-[shake_0.4s_ease-in-out]">
                                        <AlertTriangle size={16} /> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-4 flex items-center justify-center gap-3 py-3.5 text-base font-bold rounded-xl text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Access Dashboard' : 'Initialize Personnel Profile'}
                                            <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Super Admin Toggle Footer */}
                        <div className="mt-8 text-center animate-[fadeIn_1s_ease-out]">
                            {mode !== 'super_admin' ? (
                                <button
                                    onClick={() => { setMode('super_admin'); setError(''); }}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
                                >
                                    <KeyRound size={14} /> Request Higher Clearance
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setMode('register'); setError(''); }}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
                                >
                                    <ArrowLeft size={14} /> Return to Standard Registration
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer theme="dark" />

            <style>{`
                @keyframes slowZoom { 0% { transform: scale(1.02); } 100% { transform: scale(1.1); } }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                @keyframes slideUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
                @keyframes slideDown { 0% { transform: translateY(-10px); opacity: 0; height: 0; } 100% { transform: translateY(0); opacity: 1; height: auto; } }
                @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
            `}</style>
        </div>
    );
}
