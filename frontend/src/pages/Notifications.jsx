import { useEffect, useState, useCallback } from 'react';
import api from '../api';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(() => {
    api.get('/notifications').then(res => setNotifications(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell size={24} className="text-blue-600" />
            Notifications & Alerts
          </h2>
          <p className="text-gray-500">Keep track of your budget limits and account activity.</p>
        </div>
      </header>
      
      <div className="card divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Bell size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="text-lg font-medium">All caught up!</p>
            <p>You have no new notifications.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-6 flex items-start gap-4 transition-colors ${!n.is_read ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
              <div className={`p-2 rounded-full mt-1 ${!n.is_read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                {n.message.includes('Alert') ? <AlertCircle size={20} /> : <Bell size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className={`text-lg ${!n.is_read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{n.message}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      <Clock size={14} />
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!n.is_read && (
                    <button 
                      onClick={() => markAsRead(n.id)} 
                      className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm"
                    >
                      <CheckCircle size={16} />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
