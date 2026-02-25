import React, { useState, useEffect } from 'react';
import { PackageOpen, Users, Save, CheckCircle2, AlertCircle, Plus, Edit2, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/coordination';

export default function CampDirector({ camps, onCampUpdated }) {
    const [selectedCampId, setSelectedCampId] = useState('');
    const [camp, setCamp] = useState(null);

    // Capacity states
    const [capacity, setCapacity] = useState({ total: 0, currentOccupancy: 0 });
    const [savingCap, setSavingCap] = useState(false);
    const [capMsg, setCapMsg] = useState('');

    // Inventory states
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({ item: '', quantity: '', unit: 'units' });
    const [savingInv, setSavingInv] = useState(false);
    const [invMsg, setInvMsg] = useState('');
    const [editingItem, setEditingItem] = useState(null); // name of item being edited

    // Sync state when selection changes
    useEffect(() => {
        if (!selectedCampId) {
            setCamp(null);
            return;
        }
        const found = camps.find(c => c._id === selectedCampId);
        if (found) {
            setCamp(found);
            setCapacity({
                total: found.capacity?.total || 0,
                currentOccupancy: found.capacity?.currentOccupancy || 0
            });
            setInventory([...(found.inventory || [])]);
            setEditingItem(null);
            setNewItem({ item: '', quantity: '', unit: 'units' });
        }
    }, [selectedCampId, camps]);

    const handleSaveCapacity = async () => {
        if (!camp) return;
        setSavingCap(true);
        setCapMsg('');
        try {
            const { data } = await axios.patch(`${API}/camps/${camp._id}/capacity`, {
                total: Number(capacity.total),
                currentOccupancy: Number(capacity.currentOccupancy)
            });
            setCapMsg('Capacity updated successfully');
            setTimeout(() => setCapMsg(''), 3000);
            if (onCampUpdated) onCampUpdated(data);
        } catch (err) {
            setCapMsg('Failed to update capacity');
        } finally {
            setSavingCap(false);
        }
    };

    const handleSaveItem = async (itemDef) => {
        if (!camp || !itemDef.item || itemDef.quantity === '') return;
        setSavingInv(true);
        setInvMsg('');
        try {
            const { data } = await axios.patch(`${API}/camps/${camp._id}/inventory-item`, {
                item: itemDef.item,
                quantity: Number(itemDef.quantity),
                unit: itemDef.unit
            });
            setInvMsg(`"${itemDef.item}" updated successfully`);
            setTimeout(() => setInvMsg(''), 3000);
            setEditingItem(null);
            setNewItem({ item: '', quantity: '', unit: 'units' });
            if (onCampUpdated) onCampUpdated(data);
        } catch (err) {
            setInvMsg('Failed to update inventory');
        } finally {
            setSavingInv(false);
        }
    };

    const inputClass = 'bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldAlert size={22} className="text-blue-500" />
                        Camp Director Panel
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Manage camp capacity and inventory levels</p>
                </div>

                <select
                    className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 focus:outline-none min-w-[200px]"
                    value={selectedCampId}
                    onChange={(e) => setSelectedCampId(e.target.value)}
                >
                    <option value="">-- Select a Camp to Manage --</option>
                    {camps.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {!camp ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center text-slate-500">
                    <PackageOpen size={48} className="mb-4 opacity-50" />
                    <p>Please select a camp from the dropdown above to manage its details.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* CAPACITY MODULE */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex items-center gap-2">
                            <Users size={18} className="text-emerald-400" />
                            <h3 className="font-semibold">Capacity Management</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1.5 uppercase font-semibold tracking-wider">Total Capacity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className={`${inputClass} w-full text-lg font-mono`}
                                        value={capacity.total}
                                        onChange={(e) => setCapacity({ ...capacity, total: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1.5 uppercase font-semibold tracking-wider">Current Occupancy</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className={`${inputClass} w-full text-lg font-mono`}
                                        value={capacity.currentOccupancy}
                                        onChange={(e) => setCapacity({ ...capacity, currentOccupancy: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                <div className="text-sm">
                                    {capMsg && (
                                        <span className={`flex items-center gap-1.5 ${capMsg.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {capMsg.includes('Failed') ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                                            {capMsg}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleSaveCapacity}
                                    disabled={savingCap}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    {savingCap ? 'Saving...' : 'Update Capacity'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* INVENTORY MODULE */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden lg:row-span-2">
                        <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <PackageOpen size={18} className="text-orange-400" />
                                <h3 className="font-semibold">Inventory Control</h3>
                            </div>
                            {invMsg && (
                                <span className="text-xs text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> {invMsg}
                                </span>
                            )}
                        </div>

                        <div className="p-0 max-h-[500px] overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">Item</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Quantity</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {inventory.map(inv => {
                                        const isEditing = editingItem === inv.item;
                                        return (
                                            <tr key={inv.item} className="hover:bg-slate-700/20 transition-colors">
                                                <td className="px-4 py-3 font-medium text-slate-200">{inv.item}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${inv.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {isEditing ? (
                                                        <div className="flex justify-end gap-1">
                                                            <input
                                                                type="number"
                                                                className={`${inputClass} w-20 py-1 px-2 text-right`}
                                                                defaultValue={inv.quantity}
                                                                id={`edit-qty-${inv.item}`}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="font-mono">{inv.quantity} <span className="text-slate-500 text-xs ml-1">{inv.unit}</span></span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {isEditing ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setEditingItem(null)}
                                                                className="text-slate-400 hover:text-white text-xs"
                                                            >Cancel</button>
                                                            <button
                                                                onClick={() => handleSaveItem({
                                                                    item: inv.item,
                                                                    quantity: document.getElementById(`edit-qty-${inv.item}`).value,
                                                                    unit: inv.unit
                                                                })}
                                                                className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                                                            >Save</button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setEditingItem(inv.item)}
                                                            className="text-slate-400 hover:text-blue-400 transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Add New Item */}
                        <div className="p-4 bg-slate-900/30 border-t border-slate-700">
                            <h4 className="text-xs text-slate-400 uppercase font-semibold mb-3">Record New Supply</h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Item Name (e.g. Generators)"
                                    className={`${inputClass} flex-1`}
                                    value={newItem.item}
                                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    className={`${inputClass} w-20`}
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                />
                                <select
                                    className={`${inputClass} w-24`}
                                    value={newItem.unit}
                                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                >
                                    <option value="units">units</option>
                                    <option value="liters">liters</option>
                                    <option value="kg">kg</option>
                                    <option value="boxes">boxes</option>
                                    <option value="pallets">pallets</option>
                                </select>
                                <button
                                    onClick={() => handleSaveItem(newItem)}
                                    disabled={savingInv || !newItem.item || !newItem.quantity}
                                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
