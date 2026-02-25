import React, { useState, useEffect } from 'react';
import MissingReportForm from './MissingReportForm';
import axios from 'axios';

const API = 'https://suraksha-e-seva-fn1k.onrender.com/api/coordination';

export default function MissingReport({ user }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/missing-persons`);
            setReports(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'super_admin')) {
            fetchReports();
        }
    }, [user]);

    const makeUrl = (p) => {
        if (!p) return '';
        if (p.startsWith('http')) return p;
        if (p.startsWith('/')) return `https://suraksha-e-seva-fn1k.onrender.com${p}`;
        return `https://suraksha-e-seva-fn1k.onrender.com/${p}`;
    };

    return (
        <div className="space-y-8">
            <MissingReportForm onSubmitted={user && (user.role === 'admin' || user.role === 'super_admin') ? fetchReports : null} />

            {(user && (user.role === 'admin' || user.role === 'super_admin')) && (
                <div className="clay-card p-6 space-y-4">
                    <h2 className="text-xl font-bold text-purple-400">Reported Missing People</h2>
                    {loading ? (
                        <p className="text-slate-400">Loading...</p>
                    ) : reports.length === 0 ? (
                        <p className="text-slate-400">No reports yet</p>
                    ) : (
                        <div className="space-y-3">
                            {reports.map(r => (
                                <div key={r._id} className="flex items-center gap-4 border-b border-slate-700 pb-3">
                                    {r.photo && <img src={makeUrl(r.photo)} alt={r.name} className="w-16 h-16 object-cover rounded" />}
                                    <div>
                                        <p className="text-white font-semibold">{r.name} {r.age ? `(${r.age})` : ''}</p>
                                        <p className="text-slate-400 text-xs">Last seen: {r.lastSeenLocation} {r.lastSeenDate ? `on ${new Date(r.lastSeenDate).toLocaleDateString()}` : ''}</p>
                                        {r.description && <p className="text-slate-300 text-xs mt-1">{r.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
