import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/coordination';

export default function MissingReportForm({ onSubmitted }) {
    const [form, setForm] = useState({
        name: '',
        age: '',
        lastSeenLocation: '',
        lastSeenDate: '',
        description: ''
    });
    const [photo, setPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (v !== '') data.append(k, v);
            });
            if (photo) data.append('photo', photo);
            await axios.post(`${API}/missing-persons`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm({ name: '', age: '', lastSeenLocation: '', lastSeenDate: '', description: '' });
            setPhoto(null);
            if (onSubmitted) onSubmitted();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Submission failed');
        }
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 glass-panel rounded-xl space-y-3 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-purple-400">Report Missing Person</h3>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="space-y-2">
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full name" className="w-full bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2" />
                <input type="number" min="0" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    placeholder="Age (optional)" className="w-full bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2" />
                <input value={form.lastSeenLocation} onChange={e => setForm(f => ({ ...f, lastSeenLocation: e.target.value }))}
                    placeholder="Last seen location" className="w-full bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2" />
                <input type="date" value={form.lastSeenDate} onChange={e => setForm(f => ({ ...f, lastSeenDate: e.target.value }))}
                    className="w-full bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2" />
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Description / notes" rows={3}
                    className="w-full bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2" />
                <label className="block text-sm text-slate-300">
                    Photo (optional)
                    <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])}
                        className="mt-1" />
                </label>
            </div>
            <button type="submit" disabled={submitting}
                className="w-full clay-btn clay-btn-purple py-2 text-sm transition disabled:opacity-50">
                {submitting ? 'Sending...' : 'Submit Report'}
            </button>
        </form>
    );
}
