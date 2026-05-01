import { useEffect, useState } from 'react';
import api from '../api';
import { formatCurrency } from '../utils';
import { Calendar, PieChart, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

export default function Reports() {
  const [report, setReport] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.preferred_currency || 'USD';
  
  const currentMonth = new Date().toISOString().substring(0, 7);
  const [month, setMonth] = useState(currentMonth);

  useEffect(() => {
    api.get(`/reports/monthly?month=${month}`).then(res => setReport(res.data)).catch(console.error);
  }, [month]);

  if (!report) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PieChart size={24} className="text-blue-600" />
            Financial Analysis
          </h2>
          <p className="text-gray-500">A detailed breakdown of your income and spending habits.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm w-fit">
          <Calendar size={16} className="text-gray-400" />
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="outline-none text-sm font-medium" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-600" />
              Income Distribution
            </h3>
            <span className="text-xl font-bold text-green-600">{formatCurrency(report.totalIncome, currency)}</span>
          </div>
          <div className="p-6">
            {Object.keys(report.incomeByCategory).length === 0 ? (
              <p className="text-center py-8 text-gray-400 italic">No income recorded for this month.</p>
            ) : (
              <ul className="space-y-4">
                {Object.entries(report.incomeByCategory).map(([cat, amount]) => (
                  <li key={cat} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{cat}</span>
                      <span className="font-bold text-gray-900">{formatCurrency(amount, currency)}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full" 
                        style={{ width: `${(amount / report.totalIncome) * 100}%` }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingDown size={20} className="text-red-600" />
              Expense Distribution
            </h3>
            <span className="text-xl font-bold text-red-600">{formatCurrency(report.totalExpense, currency)}</span>
          </div>
          <div className="p-6">
            {Object.keys(report.expenseByCategory).length === 0 ? (
              <p className="text-center py-8 text-gray-400 italic">No expenses recorded for this month.</p>
            ) : (
              <ul className="space-y-4">
                {Object.entries(report.expenseByCategory).map(([cat, amount]) => (
                  <li key={cat} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{cat}</span>
                      <span className="font-bold text-gray-900">{formatCurrency(amount, currency)}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-500 h-full rounded-full" 
                        style={{ width: `${(amount / report.totalExpense) * 100}%` }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="card p-6 bg-blue-600 text-white flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">Net Savings for {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          <h3 className="text-3xl font-bold mt-1">{formatCurrency(report.totalIncome - report.totalExpense, currency)}</h3>
        </div>
        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
          <ChevronRight size={32} />
        </div>
      </div>
    </div>
  );
}
