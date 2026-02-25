import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Plus, Search, Filter, ClipboardList } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/coordination';

const skillOptions = ['Medical', 'Cooking', 'Driving', 'Construction', 'Translation'];

const VolunteerPanel = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [filter, setFilter] = useState({ skill: '', status: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', skills: [] });
    const [submitting, setSubmitting] = useState(false);

    // Assignment State
    const [assigningTo, setAssigningTo] = useState(null); // volunteer id
    const [taskForm, setTaskForm] = useState({ description: '', urgency: 'Medium' });
    const [assigningTask, setAssigningTask] = useState(false);

    const fetchVolunteers = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter.skill) params.skill = filter.skill;
            if (filter.status) params.status = filter.status;
            const res = await axios.get(`${API}/volunteers`, { params });
            setVolunteers(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchVolunteers(); }, [filter]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${API}/volunteers`, {
                ...form,
                status: 'Available',
                currentLocation: { type: 'Point', coordinates: [-74.0, 40.73] }
            });
            setForm({ name: '', phone: '', skills: [] });
            setShowForm(false);
            fetchVolunteers();
        } catch (err) {
            console.error(err);
        }
        setSubmitting(false);
    };

    const toggleSkill = (skill) => {
        setForm(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const statusColor = (status) =>
        status === 'Available' ? 'text-green-400 bg-green-400/10' : 'text-orange-400 bg-orange-400/10';

    const handleAssignTask = async (e) => {
        e.preventDefault();
        setAssigningTask(true);
        try {
            await axios.post(`${API}/tasks`, {
                description: taskForm.description,
                urgency: taskForm.urgency,
                assignedTo: assigningTo,
                status: 'Pending'
            });

            // Automatically update the personnel's status to On-Mission
            await axios.patch(`${API}/volunteers/${assigningTo}/status`, {
                status: 'On-Mission'
            });

            // Task created successfully
            setAssigningTo(null);
            setTaskForm({ description: '', urgency: 'Medium' });
            fetchVolunteers(); // Refresh to update the UI status immediately
        } catch (err) {
            console.error("Failed to assign task", err);
        }
        setAssigningTask(false);
    };

    const displayedVolunteers = volunteers.filter(v => {
        if (!v || !v.name) return false;
        return v.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-blue-400">Dispatch Registry</h2>
                    <p className="text-slate-400 text-sm mt-1">{displayedVolunteers.length} active personnel {searchQuery && '(filtered)'}</p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 clay-btn px-4 py-2 text-sm transition"
                >
                    <Plus size={16} /> Register
                </button>
            </div>

            {/* Register Form */}
            {showForm && (
                <form onSubmit={handleRegister} className="mb-5 p-4 bg-slate-900/60 rounded-xl border border-slate-600">
                    <h3 className="text-sm font-semibold mb-3 text-slate-300">New Volunteer</h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                            required
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Full Name"
                            className="bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                        <input
                            value={form.phone}
                            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                            placeholder="Phone (optional)"
                            className="bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {skillOptions.map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => toggleSkill(s)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${form.skills.includes(s)
                                    ? 'bg-blue-600 border-blue-400 text-white'
                                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full clay-btn py-2 text-sm transition disabled:opacity-50"
                    >
                        {submitting ? 'Registering...' : 'Register Volunteer'}
                    </button>
                </form>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex items-center gap-2 flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2">
                    <Search size={14} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search personnel..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent text-slate-300 text-sm w-full focus:outline-none placeholder-slate-500"
                    />
                </div>
                <div className="flex items-center gap-2 flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2">
                    <Filter size={14} className="text-slate-400" />
                    <select
                        value={filter.skill}
                        onChange={e => setFilter(p => ({ ...p, skill: e.target.value }))}
                        className="bg-transparent text-slate-300 text-sm flex-1 focus:outline-none"
                    >
                        <option value="">All Skills</option>
                        {skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2">
                    <select
                        value={filter.status}
                        onChange={e => setFilter(p => ({ ...p, status: e.target.value }))}
                        className="bg-transparent text-slate-300 text-sm flex-1 focus:outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="On-Mission">On-Mission</option>
                    </select>
                </div>
            </div>

            {/* Volunteer List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {loading ? (
                    <div className="text-center text-slate-400 py-8">Loading...</div>
                ) : displayedVolunteers.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">No personnel found</div>
                ) : (
                    displayedVolunteers.map(v => (
                        <div key={v._id} className="bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-500 transition overflow-hidden">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${v.status === 'Available' ? 'bg-green-900/50 text-green-400' : 'bg-orange-900/50 text-orange-400'
                                        }`}>
                                        {v.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{v.name}</p>
                                        <p className="text-xs text-slate-400">{v.skills?.join(', ') || 'General'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(v.status)}`}>
                                        {v.status}
                                    </span>
                                    {v.status === 'Available' && (
                                        <button
                                            onClick={() => setAssigningTo(assigningTo === v._id ? null : v._id)}
                                            className="clay-btn px-3 py-1 text-xs"
                                        >
                                            <ClipboardList size={12} className="inline mr-1" /> Assign Task
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Task Assignment Inline Form */}
                            {assigningTo === v._id && (
                                <form onSubmit={handleAssignTask} className="p-3 bg-slate-800/80 border-t border-slate-700">
                                    <p className="text-xs font-semibold text-slate-300 mb-2">Dispatch Order for {v.name}</p>
                                    <div className="flex gap-2">
                                        <input
                                            required
                                            value={taskForm.description}
                                            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                            placeholder="Mission details..."
                                            className="bg-slate-900 text-white text-xs border border-slate-600 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none flex-1"
                                        />
                                        <select
                                            value={taskForm.urgency}
                                            onChange={(e) => setTaskForm({ ...taskForm, urgency: e.target.value })}
                                            className="bg-slate-900 text-white text-xs border border-slate-600 rounded-lg px-2 py-1.5 focus:border-blue-500 outline-none w-24"
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                        </select>
                                        <button
                                            type="submit"
                                            disabled={assigningTask || !taskForm.description}
                                            className="clay-btn clay-btn-purple px-3 py-1.5 text-xs whitespace-nowrap disabled:opacity-50"
                                        >
                                            {assigningTask ? 'Dispatching...' : 'Dispatch'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VolunteerPanel;
