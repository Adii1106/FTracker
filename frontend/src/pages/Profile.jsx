import { useEffect, useState } from 'react';
import api from '../api';

export default function Profile() {
  const [goals, setGoals] = useState({ shortTermGoal: '', longTermGoal: '', notes: '', preferred_currency: 'USD' });
  const [saving, setSaving] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/profile').then(res => setGoals(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/profile', goals);
      // Update local storage user just in case
      localStorage.setItem('user', JSON.stringify({ ...user, preferred_currency: goals.preferred_currency }));
      alert('Profile saved successfully!');
    } catch (err) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 border rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      
      <div className="mb-8 p-4 bg-gray-50 border rounded">
        <p className="text-sm text-gray-500">Name</p>
        <p className="font-bold mb-2">{user.name}</p>
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-bold">{user.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Preferred Currency</label>
          <select 
            className="w-full border p-2 rounded bg-white"
            value={goals.preferred_currency || 'USD'}
            onChange={e => setGoals({...goals, preferred_currency: e.target.value})}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold mb-1">Short Term Goals</label>
          <textarea 
            className="w-full border p-2 rounded h-24" 
            placeholder="e.g. Save $1,000 for emergency fund in 3 months"
            value={goals.shortTermGoal || ''}
            onChange={e => setGoals({...goals, shortTermGoal: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block font-bold mb-1">Long Term Goals</label>
          <textarea 
            className="w-full border p-2 rounded h-24" 
            placeholder="e.g. Save $50,000 for a house down payment in 3 years"
            value={goals.longTermGoal || ''}
            onChange={e => setGoals({...goals, longTermGoal: e.target.value})}
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Personal Notes</label>
          <textarea 
            className="w-full border p-2 rounded h-24" 
            placeholder="Any other financial notes..."
            value={goals.notes || ''}
            onChange={e => setGoals({...goals, notes: e.target.value})}
          />
        </div>

        <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
