import React, { useState } from 'react';
import { Megaphone, Send, Bell } from 'lucide-react';
import axios from 'axios';

const severityOptions = [
    { value: 'critical', label: '🔴 Critical', desc: 'Life-threatening shortage or immediate danger' },
    { value: 'warning', label: '🟠 Warning', desc: 'Significant shortage that needs quick action' },
    { value: 'info', label: '🔵 Info', desc: 'General update for all coordinators' },
];

const quickMessages = [
    'Water critically low at eastern sector — immediate resupply needed',
    'Medical team deployment required — Camp F overwhelmed',
    'New donation shipment arriving — volunteers needed for distribution',
    'Road to northern camps blocked — reroute logistics through Highway 9',
];

const AlertBroadcaster = () => {
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('warning');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [history, setHistory] = useState([]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSending(true);
        try {
            await axios.post('http://localhost:5000/api/alerts/broadcast', { message, severity });
            setHistory(prev => [{ message, severity, time: new Date() }, ...prev.slice(0, 4)]);
            setMessage('');
            setSent(true);
            setTimeout(() => setSent(false), 3000);
        } catch (err) {
            console.error('Broadcast failed:', err);
        }
        setSending(false);
    };

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-5">
            <div>
                <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
                    <Megaphone size={20} /> Alert Broadcasting
                </h2>
                <p className="text-slate-400 text-sm mt-1">Send real-time alerts to all connected coordinators</p>
            </div>

            {/* Severity selector */}
            <div className="grid grid-cols-3 gap-2">
                {severityOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setSeverity(opt.value)}
                        title={opt.desc}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition border ${severity === opt.value
                                ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                                : 'bg-slate-900/50 border-slate-600 text-slate-400 hover:border-slate-500'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Quick messages */}
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Quick Templates</p>
                <div className="space-y-1">
                    {quickMessages.map((qm, i) => (
                        <button
                            key={i}
                            onClick={() => setMessage(qm)}
                            className="w-full text-left text-xs text-slate-400 hover:text-slate-200 bg-slate-900/30 hover:bg-slate-700/50 px-3 py-2 rounded-lg transition border border-transparent hover:border-slate-600"
                        >
                            {qm}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message input */}
            <form onSubmit={handleSend}>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type alert message here..."
                    rows={3}
                    className="w-full bg-slate-900/60 text-white text-sm border border-slate-600 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-orange-500 transition"
                />
                <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition ${sent
                            ? 'bg-green-600 text-white'
                            : 'bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-50'
                        }`}
                >
                    {sent ? (
                        <><Bell size={16} /> Alert Broadcast Sent!</>
                    ) : (
                        <><Send size={16} /> {sending ? 'Sending...' : 'Broadcast Alert'}</>
                    )}
                </button>
            </form>

            {/* History */}
            {history.length > 0 && (
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Recent Broadcasts</p>
                    <div className="space-y-1">
                        {history.map((h, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs bg-slate-900/30 px-3 py-2 rounded-lg">
                                <span className={`shrink-0 ${h.severity === 'critical' ? 'text-red-400' : h.severity === 'warning' ? 'text-orange-400' : 'text-blue-400'}`}>●</span>
                                <span className="text-slate-300 line-clamp-1">{h.message}</span>
                                <span className="text-slate-500 shrink-0 ml-auto">{h.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertBroadcaster;
