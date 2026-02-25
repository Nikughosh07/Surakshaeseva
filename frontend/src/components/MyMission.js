import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Clock, AlertTriangle, Play, CheckCircle2, PauseCircle } from 'lucide-react';
import axios from 'axios';

const API = 'https://suraksha-e-seva-fn1k.onrender.com/api/coordination';

export default function MyMission({ user }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [volunteerStatus, setVolunteerStatus] = useState(user?.status || 'Available');
    const [statusLoading, setStatusLoading] = useState(false);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        if (!user?._id) return;

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [taskRes, alertRes] = await Promise.all([
                    axios.get(`${API}/volunteers/${user._id}/tasks`),
                    // Fetch some mock alerts or from an actual alerts endpoint if built
                    // For now, setting some static situational alerts for the demo
                    Promise.resolve({
                        data: [
                            { id: 1, message: "Severe flooding reported near Sector 4.", urgency: "High", time: "10 mins ago" },
                            { id: 2, message: "Roadways to Camp Alpha cleared for supply trucks.", urgency: "Low", time: "1 hr ago" }
                        ]
                    })
                ]);
                setTasks(taskRes.data);
                setAlerts(alertRes.data);
            } catch (err) {
                console.error("Failed to fetch mission data", err);
            }
            setLoading(false);
        };

        fetchDashboardData();
    }, [user]);

    const updateStatus = async (newStatus) => {
        setStatusLoading(true);
        try {
            await axios.patch(`${API}/volunteers/${user._id}/status`, { status: newStatus });
            setVolunteerStatus(newStatus);
        } catch (err) {
            console.error("Failed to update status", err);
        }
        setStatusLoading(false);
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const { data } = await axios.patch(`${API}/tasks/${taskId}/status`, { status: newStatus });
            setTasks(tasks.map(t => t._id === taskId ? data : t));

            if (newStatus === 'Completed') {
                updateStatus('Available');
            } else if (newStatus === 'In Progress') {
                updateStatus('On-Mission');
            }
        } catch (err) {
            console.error("Failed to update task", err);
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header & Status Card */}
            <div className="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="text-blue-500" />
                        My Mission Controller
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Welcome back, <span className="font-semibold text-white">{user.name}</span>.
                        Specialty: <span className="text-blue-400 capitalize">{user.volunteerRole || 'General'}</span>
                    </p>
                </div>

                <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50">
                    {['Available', 'On-Mission', 'Resting'].map(s => (
                        <button
                            key={s}
                            onClick={() => updateStatus(s)}
                            disabled={statusLoading}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${volunteerStatus === s
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task List */}
                <div className="col-span-2 clay-card p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        Assigned Objectives
                    </h3>

                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-slate-400 text-center py-8">Syncing objectives...</p>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-slate-700/50">
                                <p className="text-slate-400">No active objectives assigned.</p>
                                <p className="text-sm text-slate-500 mt-1">Stand by for dispatch orders.</p>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div key={task._id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 transition-all hover:border-slate-500">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{task.description}</h4>
                                            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                                                <MapPin size={14} />
                                                {task.camp?.name || 'Field Operation'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.urgency === 'High' ? 'bg-red-500/20 text-red-400' :
                                            task.urgency === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {task.urgency} Priority
                                        </span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Status: <span className={task.status === 'Completed' ? 'text-green-400' : 'text-blue-400'}>{task.status}</span>
                                        </span>

                                        <div className="flex gap-2">
                                            {task.status !== 'Completed' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task._id, 'Completed')}
                                                    className="flex items-center gap-1.5 clay-btn clay-btn-slate px-3 py-1.5 text-xs text-green-400 hover:text-green-300"
                                                >
                                                    <CheckCircle2 size={14} /> Mark Complete
                                                </button>
                                            )}
                                            {task.status === 'Pending' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task._id, 'In Progress')}
                                                    className="flex items-center gap-1.5 clay-btn px-3 py-1.5 text-xs rounded-lg"
                                                >
                                                    <Play size={14} /> Start Task
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Current Situation Feed */}
                <div className="glass-panel p-6 rounded-xl h-fit">
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-red-400">
                        <AlertTriangle size={18} />
                        Sector Updates
                    </h3>

                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className="border-l-2 border-red-500 pl-4 py-1">
                                <p className="text-sm font-medium text-slate-200">{alert.message}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {alert.time}
                                    </span>
                                    <span className={alert.urgency === 'High' ? 'text-red-400' : 'text-blue-400'}>
                                        {alert.urgency} Urgency
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                        <p className="text-xs text-slate-400 text-center">
                            Stay safe! Ensure your status is accurate so Dispatch knows your availability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
