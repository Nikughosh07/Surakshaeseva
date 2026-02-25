import React, { useState } from 'react';
import { MapPin, Users, Package, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const CampLocator = ({ camps }) => {
    const [expanded, setExpanded] = useState(null);
    const [filter, setFilter] = useState('all');

    const filtered = camps.filter(camp => {
        if (filter === 'critical') return camp.priorityScore > 50 || camp.inventory?.some(i => i.status === 'Critical');
        if (filter === 'stable') return !camp.inventory?.some(i => i.status === 'Critical');
        return true;
    });

    const getOccupancyPct = (camp) => {
        const { currentOccupancy, total } = camp.capacity || {};
        if (!total) return 0;
        return Math.round((currentOccupancy / total) * 100);
    };

    const isCritical = (camp) =>
        camp.priorityScore > 50 || camp.inventory?.some(i => i.status === 'Critical');

    return (
        <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <MapPin size={20} /> Camp Locator
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        {camps.filter(isCritical).length} of {camps.length} camps need priority support
                    </p>
                </div>
                <div className="flex gap-2">
                    {['all', 'critical', 'stable'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {filtered.map(camp => {
                    const critical = isCritical(camp);
                    const occ = getOccupancyPct(camp);
                    const isOpen = expanded === camp._id;

                    return (
                        <div
                            key={camp._id}
                            className={`rounded-xl border transition-all ${critical
                                ? 'border-red-700/60 bg-red-950/20'
                                : 'border-slate-700 bg-slate-900/40'
                                }`}
                        >
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setExpanded(isOpen ? null : camp._id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${critical ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                        <div>
                                            <p className="font-semibold text-white text-sm">{camp.name}</p>
                                            <p className="text-xs text-slate-400">{camp.location?.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${critical ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                            }`}>
                                            {critical ? '⚡ Critical' : '✓ Stable'}
                                        </span>
                                        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                    </div>
                                </div>

                                {/* Occupancy bar */}
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span className="flex items-center gap-1"><Users size={11} /> Occupancy</span>
                                        <span>{camp.capacity?.currentOccupancy} / {camp.capacity?.total} ({occ}%)</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${occ > 90 ? 'bg-red-500' : occ > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${occ}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded inventory */}
                            {isOpen && (
                                <div className="px-4 pb-4 border-t border-slate-700/50 pt-3">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                                        <Package size={11} /> Inventory
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {camp.inventory?.map(inv => (
                                            <div
                                                key={inv.item}
                                                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${inv.status === 'Critical'
                                                    ? 'bg-red-900/30 border border-red-700/40'
                                                    : 'bg-slate-800/50 border border-slate-700/30'
                                                    }`}
                                            >
                                                <span className={inv.status === 'Critical' ? 'text-red-300' : 'text-slate-300'}>
                                                    {inv.status === 'Critical' && '⚠️ '}{inv.item}
                                                </span>
                                                <span className="font-bold text-white ml-2">{inv.quantity} {inv.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="text-center text-slate-400 py-10">No camps match this filter</div>
                )}
            </div>
        </div>
    );
};

export default CampLocator;
