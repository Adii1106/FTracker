import { useEffect, useState, useCallback } from 'react';
import api from '../api';
import { ListTree, Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('EXPENSE');

  const fetchCategories = useCallback(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, type });
      setName('');
      fetchCategories();
    } catch (err) {
      alert('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? This will also remove any budgets associated with it.')) {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ListTree size={20} className="text-blue-600" />
          Manage Categories
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.length === 0 ? (
            <div className="col-span-2 card p-12 text-center text-gray-500">No categories found. Add one to get started!</div>
          ) : categories.map(c => (
            <div key={c.id} className="card p-4 flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${c.type === 'INCOME' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {c.type === 'INCOME' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{c.type}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-gray-300 hover:text-red-600 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="md:w-80">
        <div className="sticky top-24 card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" />
            Add New
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="input-field" 
                placeholder="e.g. Groceries, Salary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Transaction Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="input-field bg-white">
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <Plus size={20} /> Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
