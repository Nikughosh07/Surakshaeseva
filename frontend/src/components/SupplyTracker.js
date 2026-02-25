import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingDown, TrendingUp, Package } from 'lucide-react';

const SUPPLY_GOALS = {
  "Water": 5000,
  "Food Rations": 3000,
  "First Aid Kits": 1000,
  "Blankets": 2000,
  "Flashlights": 1500,
};

const SupplyTracker = ({ camps }) => {
  const aggregateData = () => {
    const totals = Object.keys(SUPPLY_GOALS).reduce((acc, key) => {
      acc[key] = { current: 0, goal: SUPPLY_GOALS[key] };
      return acc;
    }, {});

    camps.forEach(camp => {
      camp.inventory?.forEach(item => {
        if (totals[item.item]) {
          totals[item.item].current += item.quantity;
        }
      });
    });

    return Object.entries(totals).map(([name, { current, goal }]) => ({
      name,
      Current: current,
      Needed: Math.max(0, goal - current),
      pct: Math.round((current / goal) * 100),
    }));
  };

  const data = aggregateData();
  const criticalItems = data.filter(d => d.pct < 30);
  const totalItems = data.reduce((sum, d) => sum + d.Current, 0);
  const totalGoal = data.reduce((sum, d) => sum + d.Current + d.Needed, 0);
  const efficiency = Math.round((totalItems / totalGoal) * 100);

  return (
    <div className="clay-card p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <Package size={20} /> Regional Supply Impact
        </h2>
        <p className="text-sm text-slate-400 mt-1">Real-time gap analysis across all active relief sectors</p>
      </div>

      {/* Alert row */}
      {criticalItems.length > 0 && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 flex items-center gap-3">
          <TrendingDown size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">
            Critical shortage: <strong>{criticalItems.map(i => i.name).join(', ')}</strong>
          </p>
        </div>
      )}

      {/* Bar Chart */}
      <div className="h-64 min-h-[250px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, left: 0, right: 30, bottom: 0 }} barCategoryGap="15%">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={110} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
              itemStyle={{ color: '#fff' }}
              formatter={(val, name) => [val.toLocaleString(), name]}
            />
            <Legend />
            <Bar dataKey="Current" stackId="a" fill="#22c55e" name="Have" />
            <Bar dataKey="Needed" stackId="a" fill="#ef4444" name="Still Needed" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Fulfillment</p>
          <p className={`text-xl font-bold mt-1 ${efficiency > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
            {efficiency}%
          </p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Shortage Items</p>
          <p className={`text-xl font-bold mt-1 ${criticalItems.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {criticalItems.length}
          </p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Donation Rate</p>
          <p className="text-xl font-bold mt-1 text-blue-400 flex items-center justify-center gap-1">
            <TrendingUp size={14} /> 92%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplyTracker;
