import { useEffect, useState, useCallback } from 'react';
import api from '../api';

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
    if (window.confirm('Delete category?')) {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex gap-8">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">Your Categories</h2>
        <ul className="space-y-2">
          {categories.map(c => (
            <li key={c.id} className="p-3 bg-white border rounded flex justify-between items-center">
              <div>
                <span className="font-bold">{c.name}</span>
                <span className={`ml-2 text-xs px-2 py-1 rounded ${c.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.type}</span>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="w-1/3 bg-white p-6 border rounded shadow-sm h-fit">
        <h2 className="text-lg font-bold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full border p-2 rounded">
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Add</button>
        </form>
      </div>
    </div>
  );
}
