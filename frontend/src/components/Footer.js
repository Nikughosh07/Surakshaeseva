import React from 'react';
import logo from '../logo1.jpeg';
import tech4BharatLogo from '../tech4bharat_logo.png';

export default function Footer({ theme = 'light' }) {
    const isDark = theme === 'dark';

    return (
        <footer className={`w-full py-8 px-6 mt-auto border-t relative z-20 transition-colors ${isDark ? 'bg-slate-900 border-slate-800/60 text-slate-400' : 'bg-white border-slate-200/60 text-slate-600'}`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <img src={logo} alt="Suraksha e Seva Logo" className="h-10 w-auto rounded-xl shadow-sm" />
                    <div>
                        <span className={`block text-lg font-black tracking-tight leading-none ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            Suraksha <span className="text-blue-600">e Seva</span>
                        </span>
                    </div>
                </div>

                <div className={`text-sm flex items-center gap-2 font-bold px-5 py-2.5 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    Designed By<span className="text-red-500 animate-pulse"></span>Tech4Bharat
                    <img src={tech4BharatLogo} alt="Tech 4 Bharat" className="h-5 w-auto ml-1" />
                </div>
            </div>
        </footer>
    );
}
