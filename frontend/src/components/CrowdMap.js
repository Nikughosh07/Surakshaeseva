import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const API = 'http://localhost:5000/api/coordination';

// component that lets user click map to set location on form
function LocationSelector({ onChange, current }) {
    useMapEvents({
        click(e) {
            onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
    });
    return current ? (
        <Marker position={[current.lat, current.lng]} />
    ) : null;
}

export default function CrowdMap({ user }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ type: '', description: '', lat: '', lng: '', search: '' });
    const [photo, setPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/crowd-reports`);
            setReports(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.type || !form.lat || !form.lng) {
            setError('Type and location are required');
            return;
        }
        setSubmitting(true);
        try {
            // build form data to support optional photo
            const data = new FormData();
            data.append('type', form.type);
            data.append('description', form.description);
            data.append('location[lat]', form.lat);
            data.append('location[lng]', form.lng);
            if (photo) data.append('photo', photo);
            await axios.post(`${API}/crowd-reports`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm({ type: '', description: '', lat: '', lng: '', search: '' });
            setPhoto(null);
            fetchReports();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit');
        }
        setSubmitting(false);
    };

    const geocode = async (query) => {
        try {
            const resp = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            if (resp.data && resp.data.length) {
                const loc = resp.data[0];
                return { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
            }
        } catch (e) {
            console.error('geocode error', e);
        }
        return null;
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(pos => {
            setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        });
    };

    return (
        <div className="space-y-6">
            <div className="glass-panel p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-400">Community Alerts</h3>
                <p className="text-slate-300 text-sm mb-4">Report local conditions (flood, fire, roadblock, etc.) by clicking on map.</p>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <input
                        value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        placeholder="Incident type"
                        className="w-full bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2"
                    />
                    <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2"
                    />
                    <div className="flex gap-2">
                        <button type="button" onClick={useCurrentLocation} className="text-xs text-blue-400 underline">Use my location</button>
                        <input
                            type="search"
                            value={form.search || ''}
                            onChange={e => setForm(f => ({ ...f, search: e.target.value }))}
                            placeholder="Search location"
                            className="flex-grow bg-slate-800 text-white text-sm border border-slate-600 rounded-lg px-3 py-2"
                        />
                        <button
                            type="button"
                            onClick={async () => {
                                if (form.search) {
                                    const loc = await geocode(form.search);
                                    if (loc) setForm(f => ({ ...f, lat: loc.lat, lng: loc.lng }));
                                }
                            }}
                            className="text-xs text-blue-400 underline"
                        >Go</button>
                    </div>
                    <div className="text-xs text-slate-400">Click map to choose location</div>
                    <label className="block text-sm text-slate-300">
                        Image (optional)
                        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} className="mt-1" />
                    </label>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="clay-btn clay-btn-blue py-2 text-sm w-full transition disabled:opacity-50"
                    >
                        {submitting ? 'Sending...' : 'Send Report'}
                    </button>
                </form>
            </div>

            <div className="h-96 rounded-xl overflow-hidden">
                <MapContainer center={[26.2, 92.94]} zoom={6} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution="&copy; OSM"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationSelector
                        current={form.lat && form.lng ? { lat: form.lat, lng: form.lng } : null}
                        onChange={coords => setForm(f => ({ ...f, lat: coords.lat, lng: coords.lng }))}
                    />
                    {reports.map(r => (
                        <Marker key={r._id} position={[r.location.lat, r.location.lng]}>
                            <Popup>
                                <strong>{r.type}</strong><br />{r.description}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

        </div>
    );
}
