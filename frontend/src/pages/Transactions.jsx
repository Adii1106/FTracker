import { useEffect, useState, useCallback } from 'react';
import api from '../api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Form State
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
      
      // If the backend sent an alert back (like a budget overrun), show it!
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
    if(window.confirm('Delete transaction?')) {
      await api.delete(`/transactions/${id}`);
      fetchData();
    }
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="max-w-5xl mx-auto flex gap-8">
      <div className="flex-1 bg-white border rounded shadow-sm p-4">
        <h2 className="text-xl font-bold mb-4">Transactions</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.description}</td>
                <td>{t.category?.name || '-'}</td>
                <td className={`font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                </td>
                <td>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-1/3 bg-white p-6 border rounded shadow-sm h-fit">
        <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select value={type} onChange={e => { setType(e.target.value); setCategoryId(''); }} className="w-full border p-2 rounded">
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border p-2 rounded">
              <option value="">None</option>
              {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Amount ($)</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Add Transaction</button>
        </form>
      </div>
    </div>
  );
}
