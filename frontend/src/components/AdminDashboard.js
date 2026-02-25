import React, { useState, useEffect } from 'react';
import { Users, Package, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import axios from 'axios';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="clay-card p-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={22} />
        </div>
        <div>
            <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-slate-500">{sub}</p>}
        </div>
    </div>
);

const AdminDashboard = ({ stats, camps }) => {
    const [missing, setMissing] = useState([]);
    const [missingLoading, setMissingLoading] = useState(false);

    const supplyChartData = stats?.supplyTotals
        ? Object.entries(stats.supplyTotals).map(([name, value]) => ({ name, value }))
        : [];

    const taskStatusData = [
        { name: 'Pending', value: stats?.pendingTasks || 0 },
        { name: 'Completed', value: stats?.completedTasks || 0 },
    ];

    useEffect(() => {
        const fetchMissing = async () => {
            setMissingLoading(true);
            try {
                const res = await axios.get('https://suraksha-e-seva-fn1k.onrender.com/api/coordination/missing-persons');
                setMissing(res.data);
            } catch (e) {
                console.error(e);
            }
            setMissingLoading(false);
        };
        fetchMissing();
    }, []);

    const makeUrl = (p) => {
        if (!p) return '';
        if (p.startsWith('http')) return p;
        if (p.startsWith('/')) return `https://suraksha-e-seva-fn1k.onrender.com${p}`;
        return `https://suraksha-e-seva-fn1k.onrender.com/${p}`;
    };

    // Build occupancy trend from camp data
    const occupancyData = camps.slice(0, 8).map(c => ({
        name: c.name.replace('Relief Camp ', 'Camp '),
        Occupancy: c.capacity?.currentOccupancy || 0,
        Capacity: c.capacity?.total || 500,
    }));

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Package} label="Total Camps" value={stats?.totalCamps} sub={`${stats?.criticalCamps} critical`} color="bg-blue-500/20 text-blue-400" />
                <StatCard icon={Users} label="Volunteers" value={stats?.totalVolunteers} sub={`${stats?.availableVolunteers} available`} color="bg-green-500/20 text-green-400" />
                <StatCard icon={AlertTriangle} label="Pending Tasks" value={stats?.pendingTasks} sub={`${stats?.totalTasks} total`} color="bg-orange-500/20 text-orange-400" />
                <StatCard icon={CheckCircle} label="Completed Tasks" value={stats?.completedTasks} sub="mission success" color="bg-purple-500/20 text-purple-400" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Camp Occupancy */}
                <div className="glass-panel rounded-xl p-5">
                    <h3 className="text-base font-semibold text-blue-400 mb-4 flex items-center gap-2">
                        <BarChart2 size={16} /> Camp Occupancy
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={occupancyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} itemStyle={{ color: '#fff' }} />
                            <Area type="monotone" dataKey="Occupancy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                            <Area type="monotone" dataKey="Capacity" stroke="#475569" fill="transparent" strokeDasharray="4 4" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Supply Distribution */}
                <div className="glass-panel rounded-xl p-5 flex flex-col items-center">
                    <h3 className="text-base font-semibold text-blue-400 mb-2 w-full text-left">Supply Distribution</h3>
                    {supplyChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={supplyChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {supplyChartData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} itemStyle={{ color: '#fff' }} formatter={(value, name) => [`${value}`, name]} />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-slate-400 text-sm text-center py-10">No supply data available</div>
                    )}
                </div>
            </div>

            {/* Critical Camps Table */}
            <div className="glass-panel rounded-xl p-5">
                <h3 className="text-base font-semibold text-red-400 mb-4">⚠️ Critical Camps</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-400 text-xs uppercase border-b border-slate-700">
                                <th className="text-left pb-2">Camp</th>
                                <th className="text-left pb-2">Occupancy</th>
                                <th className="text-left pb-2">Priority</th>
                                <th className="text-left pb-2">Critical Needs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {camps
                                .filter(c => c.priorityScore > 0 || c.inventory?.some(i => i.status === 'Critical'))
                                .map(camp => (
                                    <tr key={camp._id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                                        <td className="py-2 text-white font-medium">{camp.name}</td>
                                        <td className="py-2 text-slate-300">
                                            {camp.capacity?.currentOccupancy}/{camp.capacity?.total}
                                        </td>
                                        <td className="py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${camp.priorityScore > 50 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {camp.priorityScore > 50 ? 'CRITICAL' : 'ELEVATED'}
                                            </span>
                                        </td>
                                        <td className="py-2 text-slate-400 text-xs">
                                            {camp.inventory?.filter(i => i.status === 'Critical').map(i => i.item).join(', ') || '—'}
                                        </td>
                                    </tr>
                                ))}
                            {camps.filter(c => c.priorityScore > 0 || c.inventory?.some(i => i.status === 'Critical')).length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-slate-500">All camps operating normally</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Missing Persons Reports */}
            <div className="glass-panel rounded-xl p-5">
                <h3 className="text-base font-semibold text-purple-400 mb-4">Missing Person Reports</h3>
                {missingLoading ? (
                    <p className="text-slate-400">Loading...</p>
                ) : missing.length === 0 ? (
                    <p className="text-slate-400">No reports available</p>
                ) : (
                    <div className="space-y-3">
                        {missing.map(r => (
                            <div key={r._id} className="flex items-center gap-4 border-b border-slate-700 pb-3">
                                {r.photo && <img src={makeUrl(r.photo)} alt={r.name} className="w-12 h-12 object-cover rounded" />}
                                <div>
                                    <p className="text-white font-medium">{r.name}{r.age ? ` (${r.age})` : ''}</p>
                                    <p className="text-slate-400 text-xs">Last seen: {r.lastSeenLocation}{r.lastSeenDate ? ` on ${new Date(r.lastSeenDate).toLocaleDateString()}` : ''}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
