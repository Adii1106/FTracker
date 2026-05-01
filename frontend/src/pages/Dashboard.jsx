import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white border rounded shadow-sm">
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-2xl font-bold">${data.totalBalance?.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow-sm">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-2xl font-bold text-green-600">${data.totalIncome?.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow-sm">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">${data.totalExpense?.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="bg-white border rounded shadow-sm p-4">
        {data.recentTransactions?.length === 0 ? <p>No transactions yet.</p> : (
          <ul className="divide-y">
            {data.recentTransactions.map(t => (
              <li key={t.id} className="py-2 flex justify-between">
                <div>
                  <p className="font-semibold">{t.description}</p>
                  <p className="text-sm text-gray-500">{t.category?.name || 'Uncategorized'} • {new Date(t.date).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
