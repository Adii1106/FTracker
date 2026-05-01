import { useEffect, useState, useCallback } from 'react';
import api from '../api';
import { formatCurrency } from '../utils';
import { PieChart, Plus, Calendar } from 'lucide-react';

export default function Budgets() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.preferred_currency || 'USD';
  
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
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PieChart size={20} className="text-blue-600" />
            Monthly Budgets
          </h2>
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
            <Calendar size={16} className="text-gray-400" />
            <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="outline-none text-sm font-medium" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {budgets.length === 0 ? (
            <div className="col-span-2 card p-12 text-center text-gray-500">No budgets set for this month. Stay on track by setting one!</div>
          ) : budgets.map(b => (
            <div key={b.id} className="card p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-lg">{b.category?.name}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Spending Limit</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(b.limit_amount, currency)}</p>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="md:w-80">
        <div className="sticky top-24 card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" />
            Set Budget
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="input-field bg-white">
                <option value="">Select Expense...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Monthly Limit ({currency})</label>
              <input 
                type="number" 
                step="0.01" 
                value={limitAmount} 
                onChange={e => setLimitAmount(e.target.value)} 
                required 
                className="input-field" 
                placeholder="0.00"
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <Plus size={20} /> Save Budget
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
