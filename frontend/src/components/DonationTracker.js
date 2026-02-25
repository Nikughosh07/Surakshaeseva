import React, { useState, useEffect } from 'react';
import { Heart, Truck, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/coordination';

const statusConfig = {
    'Pledged': { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-700/40', label: 'Pledged' },
    'In Transit': { icon: Truck, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-700/40', label: 'In Transit' },
    'Delivered': { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10 border-green-700/40', label: 'Delivered' },
};

const DonationTracker = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ donor: '', item: 'Water', quantity: '', unit: 'units' });
    const [submitting, setSubmitting] = useState(false);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/donations`);
            setDonations(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchDonations(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const submitForm = { ...form };
            if (submitForm.item === 'Money') {
                submitForm.unit = 'USD';
            }
            await axios.post(`${API}/donations`, submitForm);
            setForm({ donor: '', item: 'Water', quantity: '', unit: 'units' });
            setShowForm(false);
            fetchDonations();
        } catch (e) { console.error(e); }
        setSubmitting(false);
    };

    const filtered = donations.filter(d => filter === 'all' || d.status === filter);
    const delivered = donations.filter(d => d.status === 'Delivered').length;
    const efficiency = donations.length > 0 ? Math.round((delivered / donations.length) * 100) : 0;

    return (
        <div className="clay-card p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                        <Heart size={20} /> Donation Transparency
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Track every contribution from pledge to delivery — {efficiency}% delivery rate
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 clay-btn clay-btn-purple px-4 py-2 text-sm transition"
                >
                    <Heart size={14} /> Log Donation
                </button>
            </div>

            {/* Summary pills */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, cfg]) => {
                    const count = donations.filter(d => d.status === key).length;
                    const Icon = cfg.icon;
                    return (
                        <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition ${filter === key ? cfg.bg + ' ' + cfg.color : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                                }`}
                        >
                            <Icon size={12} /> {cfg.label}: {count}
                        </button>
                    );
                })}
                {filter !== 'all' && (
                    <button onClick={() => setFilter('all')}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-600 text-slate-400 hover:text-slate-200 transition"
                    >✕ Clear</button>
                )}
            </div>

            {/* Pledge form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="p-4 glass-panel rounded-xl space-y-3">
                    <h3 className="text-sm font-semibold text-slate-300">Log New Donation</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input required value={form.donor} onChange={e => setForm(p => ({ ...p, donor: e.target.value }))}
                            placeholder="Donor / Organization" className="col-span-2 bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500" />
                        <select value={form.item} onChange={e => setForm(p => ({ ...p, item: e.target.value }))}
                            className="bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500">
                            {['Money', 'Water', 'Food Rations', 'First Aid Kits', 'Blankets', 'Flashlights'].map(i => <option key={i}>{i}</option>)}
                        </select>
                        <input required type="number" min="1" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
                            placeholder="Quantity" className="bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500" />
                    </div>
                    <button type="submit" disabled={submitting}
                        className="w-full clay-btn clay-btn-purple py-2 text-sm transition disabled:opacity-50">
                        {submitting ? 'Saving...' : 'Record Donation'}
                    </button>
                </form>
            )}

            {/* Donation list */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {loading ? (
                    <div className="text-center text-slate-400 py-10">Loading donations...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-slate-400 py-10">No donations found</div>
                ) : (
                    filtered.map(d => {
                        const cfg = statusConfig[d.status] || statusConfig['Pledged'];
                        const Icon = cfg.icon;
                        return (
                            <div key={d._id} className={`flex items-center justify-between p-3 rounded-xl border ${cfg.bg} transition hover:opacity-90`}>
                                <div className="flex items-center gap-3">
                                    <Icon size={16} className={cfg.color} />
                                    <div>
                                        <p className="text-sm font-medium text-white">{d.donor}</p>
                                        <p className="text-xs text-slate-400">
                                            {d.item === 'Money' ? (
                                                <><strong className="text-green-400 font-bold">${d.quantity} {d.unit}</strong> Funding</>
                                            ) : (
                                                <>{d.quantity} {d.unit} of <strong className="text-slate-300">{d.item}</strong></>
                                            )}
                                            {d.destinationCamp?.name && <> → {d.destinationCamp.name}</>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold ${cfg.color}`}>{d.status}</span>
                                    <ChevronRight size={14} className="text-slate-600" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DonationTracker;
