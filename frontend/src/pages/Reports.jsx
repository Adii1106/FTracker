import { useEffect, useState } from 'react';
import api from '../api';

export default function Reports() {
  const [report, setReport] = useState(null);
  const currentMonth = new Date().toISOString().substring(0, 7);
  const [month, setMonth] = useState(currentMonth);

  useEffect(() => {
    api.get(`/reports/monthly?month=${month}`).then(res => setReport(res.data)).catch(console.error);
  }, [month]);

  if (!report) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Monthly Report</h2>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 border rounded shadow-sm">
          <h3 className="font-bold text-green-600 mb-4 border-b pb-2">Income: ${report.totalIncome.toFixed(2)}</h3>
          <ul className="space-y-2">
            {Object.entries(report.incomeByCategory).map(([cat, amount]) => (
              <li key={cat} className="flex justify-between">
                <span>{cat}</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 border rounded shadow-sm">
          <h3 className="font-bold text-red-600 mb-4 border-b pb-2">Expenses: ${report.totalExpense.toFixed(2)}</h3>
          <ul className="space-y-2">
            {Object.entries(report.expenseByCategory).map(([cat, amount]) => (
              <li key={cat} className="flex justify-between">
                <span>{cat}</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
