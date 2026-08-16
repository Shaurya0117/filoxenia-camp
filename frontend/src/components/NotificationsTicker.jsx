import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Megaphone, X } from 'lucide-react';

export default function NotificationsTicker() {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data.notifications.length > 0) {
          setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.error("Failed to load broadcasts", err);
      }
    };
    fetchNotifications();
  }, []);

  if (notifications.length === 0 || !visible) return null;

  const latest = notifications[0];

  return (
    <div className="bg-amber-500/20 border border-amber-500/30 text-amber-100 px-6 py-3 rounded-2xl flex items-center justify-between mb-8 backdrop-blur-md shadow-lg animate-fade-in">
      <div className="flex items-center gap-3">
        <Megaphone className="w-5 h-5 text-amber-400 animate-pulse" />
        <div>
          <span className="font-bold mr-2 text-amber-300">{latest.title}:</span>
          <span className="font-medium">{latest.message}</span>
        </div>
      </div>
      <button onClick={() => setVisible(false)} className="text-amber-300 hover:text-white transition">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
