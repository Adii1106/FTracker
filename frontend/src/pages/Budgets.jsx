import { useEffect, useState, useCallback } from 'react';
import api from '../api';

export default function Budgets() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  
  // Default to current month YYYY-MM
  const currentMonth = new Date().toISOString().substring(0, 7);
  const [month, setMonth] = useState(currentMonth);

  const fetchData = useCallback(() => {
    api.get('/categories').then(res => setCategories(res.data.filter(c => c.type === 'EXPENSE'))).catch(console.error);
    api.get(`/budgets/${month}`).then(res => setBudgets(res.data)).catch(console.error);
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { category_id: categoryId, limit_amount: parseFloat(limitAmount), month });
      setLimitAmount('');
      fetchData();
    } catch (err) {
      alert('Failed to set budget');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex gap-8">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Monthly Budgets</h2>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded" />
        </div>
        
        <ul className="space-y-2">
          {budgets.length === 0 ? <p className="text-gray-500">No budgets set for {month}.</p> : budgets.map(b => (
            <li key={b.id} className="p-4 bg-white border rounded">
              <div className="flex justify-between font-bold mb-2">
                <span>{b.category?.name}</span>
                <span>Limit: ${parseFloat(b.limit_amount).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="w-1/3 bg-white p-6 border rounded shadow-sm h-fit">
        <h2 className="text-lg font-bold mb-4">Set Budget</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full border p-2 rounded">
              <option value="">Select Expense Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Limit Amount ($)</label>
            <input type="number" step="0.01" value={limitAmount} onChange={e => setLimitAmount(e.target.value)} required className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Save Budget</button>
        </form>
      </div>
    </div>
  );
}
