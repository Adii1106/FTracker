import { useEffect, useState } from 'react';
import api from '../api';
import { formatCurrency } from '../utils';
import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.preferred_currency || 'USD';

  useEffect(() => {
    api.get('/dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const filteredTransactions = data.recentTransactions?.filter(t => {
    if (filter === 'ALL') return true;
    return t.type === filter;
  });

  const stats = [
    { label: 'Total Balance', value: data.totalBalance, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Income', value: data.totalIncome, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Expenses', value: data.totalExpense, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-gray-500 font-medium">Here's a quick overview of your finances.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-8 flex items-center gap-6 border-none shadow-md shadow-gray-200/50">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-3xl font-black mt-1 ${stat.color}`}>
                {formatCurrency(stat.value, currency)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'ALL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('INCOME')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Incomes
              </button>
              <button 
                onClick={() => setFilter('EXPENSE')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Expenses
              </button>
            </div>
          </div>
          <Link to="/transactions" className="text-sm font-bold text-blue-600 hover:text-blue-700">View all records →</Link>
        </div>
        
        <div className="card border-none shadow-md shadow-gray-200/50">
          {filteredTransactions?.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-medium">
              No transactions match your current filter.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredTransactions.map(t => (
                <div key={t.id} className="p-5 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${t.type === 'INCOME' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {t.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t.description}</p>
                      <p className="text-sm text-gray-400 font-medium">
                        {t.category?.name || 'Uncategorized'} • {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${t.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount, currency).substring(1)}
                    </p>
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">{currency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
