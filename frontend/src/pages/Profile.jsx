import { useEffect, useState } from 'react';
import api from '../api';
import { User, Target, StickyNote, Globe } from 'lucide-react';

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
      // Update local storage so other components detect currency change
      const updatedUser = { ...user, preferred_currency: goals.preferred_currency };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile updated successfully!');
      window.location.reload(); // Refresh to update currency everywhere
    } catch (err) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500">Manage your personal information and financial goals.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} />
            </div>
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="card p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Globe size={16} className="text-gray-400" />
                  Preferred Currency
                </label>
                <select 
                  className="input-field bg-white"
                  value={goals.preferred_currency || 'USD'}
                  onChange={e => setGoals({...goals, preferred_currency: e.target.value})}
                >
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="JPY">JPY (¥) - Japanese Yen</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Target size={16} className="text-gray-400" />
                  Short Term Goals
                </label>
                <textarea 
                  className="input-field h-24" 
                  placeholder="What are your goals for the next 3-6 months?"
                  value={goals.shortTermGoal || ''}
                  onChange={e => setGoals({...goals, shortTermGoal: e.target.value})}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Target size={16} className="text-gray-400" />
                  Long Term Goals
                </label>
                <textarea 
                  className="input-field h-24" 
                  placeholder="What are your goals for the next 1-5 years?"
                  value={goals.longTermGoal || ''}
                  onChange={e => setGoals({...goals, longTermGoal: e.target.value})}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <StickyNote size={16} className="text-gray-400" />
                  Financial Notes
                </label>
                <textarea 
                  className="input-field h-24" 
                  placeholder="Any other notes or reminders..."
                  value={goals.notes || ''}
                  onChange={e => setGoals({...goals, notes: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full py-3">
              {saving ? 'Saving changes...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
