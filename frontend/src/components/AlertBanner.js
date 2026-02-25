import React, { useState, useEffect } from 'react';
import { Megaphone, X, AlertTriangle, Info } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const severityConfig = {
  critical: { bg: 'bg-red-600', border: 'border-red-400', icon: <Megaphone className="animate-pulse" size={20} />, label: 'CRITICAL ALERT' },
  warning: { bg: 'bg-orange-500', border: 'border-orange-300', icon: <AlertTriangle size={20} />, label: 'WARNING' },
  info: { bg: 'bg-blue-600', border: 'border-blue-400', icon: <Info size={20} />, label: 'INFO' },
};

const AlertBanner = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on('broadcast-alert', (data) => {
      const id = Date.now();
      setAlerts(prev => [...prev, { ...data, id }]);
      setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 10000);
    });
    return () => socket.off('broadcast-alert');
  }, []);

  const dismiss = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-2 w-80">
      {alerts.map(alert => {
        const cfg = severityConfig[alert.severity] || severityConfig.info;
        return (
          <div
            key={alert.id}
            className={`${cfg.bg} text-white p-4 rounded-xl shadow-2xl flex items-start justify-between border ${cfg.border} animate-slide-in`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{cfg.icon}</div>
              <div>
                <p className="font-bold text-xs uppercase tracking-widest opacity-80">{cfg.label}</p>
                <p className="text-sm font-medium mt-0.5">{alert.message}</p>
              </div>
            </div>
            <button onClick={() => dismiss(alert.id)} className="ml-2 p-1 hover:bg-white/20 rounded transition">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AlertBanner;
