import React, { useState, useEffect } from 'react';
import logo from '../logo1.jpeg';
import tech4BharatLogo from '../tech4bharat_logo.png';
import { MapPin, Globe, Phone, Mail, Clock, Newspaper, ArrowRight, HeartPulse } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import img2 from '../img2.jpg';
import img3 from '../img3.jpg';
import img4 from '../img4.jpg';
import MissingReportForm from './MissingReportForm';
import Footer from './Footer';

const BACKGROUND_IMAGES = [
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=2070",
    img2,
    img3,
    img4
];

const NEWS_UPDATES = [
    "🚨 FLOOD ALERT: Brahmaputra water levels rising above danger mark in Kaziranga.",
    "✅ MEDICAL: Camp deployed at Majuli center.",
    "⚠️ SUPPLY: Urgent requirement for baby food at Camp Alpha.",
    "🚁 RESCUE: 45 families evacuated from Dhubri.",
    "📍 CAMPS: 12 new campsites opened across lower Assam."
];

export default function LandingPage({ onGetStarted }) {
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    // Landscape Image Slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIdx((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen font-sans relative flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
            {/* Dynamic Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[35%] h-[40%] bg-orange-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
            </div>

            {/* Glassmorphism Header */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 w-full bg-white/60 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
                <a href="/" className="flex items-center gap-3 cursor-pointer">
                    <img src={logo} alt="Suraksha e Seva Logo" className="h-10 w-auto rounded-xl shadow-sm clay-light-sm" />
                    <span className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                        SURAKSHA<span className="text-orange-500">e</span>SEVA
                    </span>
                </a>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#home" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#news" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest relative group">
                        News
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#map" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest relative group">
                        Map
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#contact" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest relative group">
                        Contact
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onGetStarted}
                        className="hidden sm:block px-5 py-2 text-sm font-bold rounded-xl text-slate-700 hover:text-blue-700 transition-all hover:bg-white clay-light-sm"
                    >
                        Sign in
                    </button>
                    <button
                        onClick={onGetStarted}
                        className="px-6 py-2.5 text-sm font-bold rounded-xl text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.5)] hover:-translate-y-0.5"
                    >
                        Register
                    </button>
                </div>
            </nav>

            {/* Separated News Ticker */}
            <div className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center overflow-hidden shadow-md z-40 relative">
                <div className="bg-red-800 px-5 py-2 flex items-center z-10 font-black text-xs sm:text-sm uppercase tracking-widest shrink-0 shadow-[4px_0_15px_rgba(0,0,0,0.3)] gap-2">
                    <HeartPulse size={16} className="animate-pulse" /> Live Updates
                </div>
                <div className="marquee-container flex-grow overflow-hidden relative h-full flex items-center">
                    <div className="marquee flex items-center whitespace-nowrap text-sm font-semibold h-full tracking-wide">
                        {NEWS_UPDATES.map((news, idx) => (
                            <span key={idx} className="mx-8 py-2.5">{news}</span>
                        ))}
                        {NEWS_UPDATES.map((news, idx) => (
                            <span key={`dup-${idx}`} className="mx-8 py-2.5">{news}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Full Width Landscape Image Slider */}
            <div className="w-full relative h-[45vh] md:h-[60vh] lg:h-[70vh] min-h-[400px] overflow-hidden clay-light-inset border-b border-white z-10 bg-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                {BACKGROUND_IMAGES.map((imgUrl, idx) => (
                    <img
                        key={idx}
                        src={imgUrl}
                        alt={`Relief Effort ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-out ${idx === currentImageIdx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
                    />
                ))}
                {/* Elegant internal gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent z-20 pointer-events-none"></div>

                {/* Slider Progress Indicators */}
                <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
                    {BACKGROUND_IMAGES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIdx(idx)}
                            className={`h-2.5 rounded-full transition-all duration-500 shadow-md ${idx === currentImageIdx ? 'w-12 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Body Area */}
            <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col gap-16" id="home">

                {/* Hero Stacked Layout */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 mt-4">
                        Coordinate Relief. <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Save Lives Together.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-3xl">
                        A centralized, dynamic platform connecting state resources, rapid response volunteers, and critical supply lines across affected zones in Assam.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto mb-16">
                        <button
                            onClick={onGetStarted}
                            className="px-10 py-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg transition-all shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_35px_rgba(37,99,235,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 border border-blue-400/30"
                        >
                            Access Dashboard <ArrowRight size={22} className="animate-pulse" />
                        </button>
                    </div>
                </div>

                {/* Body Information Sections - Clay Cards Level */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">

                    {/* News Section */}
                    <section id="news" className="clay-light-card p-8 rounded-3xl relative overflow-hidden group hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-orange-600 shadow-inner border border-white">
                                <Newspaper size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Briefings</h2>
                                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-orange-400 to-red-500 mt-1"></div>
                            </div>
                        </div>
                        <div className="space-y-5 relative z-10">
                            {NEWS_UPDATES.slice(0, 4).map((news, i) => (
                                <div key={i} className="pb-4 border-b border-slate-200/60 last:border-0 last:pb-0">
                                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{news}</p>
                                    <p className="text-xs text-orange-600/80 font-semibold mt-1.5 uppercase tracking-wide">Live • Just Now</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Map Section */}
                    <section id="map" className="clay-light-card p-8 rounded-3xl relative overflow-hidden group flex flex-col hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 shadow-inner border border-white">
                                <MapPin size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Live Map</h2>
                                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mt-1"></div>
                            </div>
                        </div>
                        <p className="text-slate-600 font-medium mb-6 leading-relaxed flex-grow">
                            Dynamic geospatial tracking of all active safe zones, relief camps, and supply drops across the affected districts.
                        </p>

                        {/* Interactive Map with Clay inner shadow */}
                        <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 relative z-10 clay-light-inset border-2 border-white group-hover:shadow-lg transition-shadow">
                            <MapContainer center={[26.2006, 92.9376]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
                                <TileLayer
                                    attribution='&copy; OSM'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </MapContainer>
                        </div>
                    </section>

                    {/* Missing report call-to-action */}
                    <section className="clay-light-card p-8 rounded-3xl relative overflow-hidden group flex flex-col hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center text-red-600 shadow-inner border border-white">
                                <MapPin size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Report a Missing Person</h2>
                                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500 mt-1"></div>
                            </div>
                        </div>
                        <MissingReportForm />
                    </section>

                    {/* Crowd-sourced incidents */}
                    <section className="clay-light-card p-8 rounded-3xl relative overflow-hidden group hover:shadow-xl hover:scale-105 transform transition-all duration-300 flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-yellow-600 shadow-inner border border-white">
                                <Globe size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Crowd Map</h2>
                                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mt-1"></div>
                            </div>
                        </div>
                        <p className="text-slate-600 flex-grow">
                            Community-sourced reports of flooding, fires, roadblocks and more.
                        </p>
                        <button
                            onClick={onGetStarted}
                            className="mt-auto px-5 py-2 text-sm font-bold rounded-xl text-slate-700 hover:text-blue-700 transition-all hover:bg-white clay-light-sm self-start"
                        >
                            Explore
                        </button>
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="clay-light-card p-8 rounded-3xl relative overflow-hidden group flex flex-col hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 shadow-inner border border-white">
                                <Phone size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Command</h2>
                                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 mt-1"></div>
                            </div>
                        </div>
                        <div className="space-y-8 flex-grow relative z-10">
                            <div className="flex gap-5 items-start">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-emerald-600 clay-light-sm"><Phone size={22} /></div>
                                <div>
                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">State Control Line</h3>
                                    <p className="text-slate-900 font-black text-xl">1070 <span className="text-slate-300 font-light mx-1">|</span> 1079</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-blue-600 clay-light-sm"><Mail size={22} /></div>
                                <div>
                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Dispatch Email</h3>
                                    <p className="text-slate-800 font-bold text-sm">sos@surakshaseva.in</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-purple-600 clay-light-sm"><Clock size={22} /></div>
                                <div>
                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">System Status</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                        <p className="text-emerald-600 font-black text-sm uppercase tracking-wider">Fully Operational</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            {/* Footer */}
            <Footer theme="light" />

            {/* Embedded Advanced Styles */}
            <style>{`
        .marquee-container { width: 100%; overflow: hidden; display: flex; }
        .marquee { display: inline-flex; animation: scroll 25s linear infinite; }
        .marquee:hover { animation-play-state: paused; }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        /* Custom Light Claymorphism (Neumorphism variants) */
        .clay-light-card {
            background: #ffffff;
            box-shadow: 
                12px 12px 24px rgba(200, 205, 215, 0.5), 
                -12px -12px 24px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255, 255, 255, 0.6),
                inset -2px -2px 4px rgba(200, 205, 215, 0.2);
            border: 1px solid rgba(255,255,255,0.8);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .clay-light-card:hover {
            transform: translateY(-4px);
            box-shadow: 
                16px 16px 32px rgba(200, 205, 215, 0.6), 
                -12px -12px 24px rgba(255, 255, 255, 1),
                inset 2px 2px 4px rgba(255, 255, 255, 0.7),
                inset -2px -2px 6px rgba(200, 205, 215, 0.25);
        }

        .clay-light-lg {
            background: #f8fafc;
            box-shadow: 
                16px 16px 32px rgba(200, 205, 215, 0.4), 
                -16px -16px 32px rgba(255, 255, 255, 0.8),
                inset 2px 2px 5px rgba(255, 255, 255, 1),
                inset -2px -2px 5px rgba(200, 205, 215, 0.1);
        }

        .clay-light-sm {
            box-shadow: 
                4px 4px 10px rgba(200, 205, 215, 0.4), 
                -4px -4px 10px rgba(255, 255, 255, 0.9),
                inset 1px 1px 2px rgba(255, 255, 255, 0.5),
                inset -1px -1px 2px rgba(200, 205, 215, 0.1);
        }
        
        .clay-light-inset {
            box-shadow: 
                inset 6px 6px 12px rgba(200, 205, 215, 0.5), 
                inset -6px -6px 12px rgba(255, 255, 255, 0.9);
        }

        html { scroll-behavior: smooth; }
        .leaflet-container { z-index: 10; font-family: 'Inter', sans-serif; }
      `}</style>
        </div>
    );
}
