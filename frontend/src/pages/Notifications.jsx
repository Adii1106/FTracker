import { useEffect, useState, useCallback } from 'react';
import api from '../api';

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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Notifications & Alerts</h2>
      
      <div className="bg-white p-4 border rounded shadow-sm">
        {notifications.length === 0 ? <p className="text-gray-500">You have no notifications.</p> : (
          <ul className="divide-y">
            {notifications.map(n => (
              <li key={n.id} className={`py-4 flex justify-between items-center ${!n.is_read ? 'bg-red-50' : ''}`}>
                <div>
                  <p className={`font-medium ${!n.is_read ? 'text-red-700 font-bold' : 'text-gray-700'}`}>{n.message}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.is_read && (
                  <button 
                    onClick={() => markAsRead(n.id)} 
                    className="bg-white border text-sm px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Mark as Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
