import { useEffect, useState, useCallback } from 'react';
import api from '../api';
import { formatCurrency } from '../utils';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle, Calendar, Tag, FileText } from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.preferred_currency || 'USD';
  
  const [type, setType] = useState('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [description, setDescription] = useState('');

  const fetchData = useCallback(() => {
    api.get('/transactions').then(res => setTransactions(res.data)).catch(console.error);
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/transactions', {
        type,
        category_id: categoryId || null,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        description
      });
      
      if (res.data.alert) {
        alert("⚠️ BUDGET ALERT: " + res.data.alert);
      }

      setAmount('');
      setDescription('');
      fetchData();
    } catch (err) {
      alert('Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this transaction?')) {
      await api.delete(`/transactions/${id}`);
      fetchData();
    }
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
          <span className="text-sm text-gray-500">{transactions.length} total</span>
        </div>
        
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No transactions found.</td></tr>
                ) : transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {t.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${t.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount, currency).substring(1)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-blue-600" />
              Add Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button 
                  type="button"
                  onClick={() => { setType('EXPENSE'); setCategoryId(''); }}
                  className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ArrowDownCircle size={16} /> Expense
                </button>
                <button 
                  type="button"
                  onClick={() => { setType('INCOME'); setCategoryId(''); }}
                  className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${type === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ArrowUpCircle size={16} /> Income
                </button>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Tag size={14} /> Category
                </label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input-field bg-white">
                  <option value="">None (Uncategorized)</option>
                  {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <span className="text-lg font-bold text-gray-400">{currency === 'USD' ? '$' : currency}</span> Amount
                </label>
                <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required className="input-field text-xl font-bold" placeholder="0.00" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <Calendar size={14} /> Date
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="input-field" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <FileText size={14} /> Description
                </label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="input-field" placeholder="What was this for?" />
              </div>

              <button type="submit" className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2">
                <Plus size={20} /> Record Transaction
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
