import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

import { LayoutDashboard, ListTree, PieChart, ReceiptText, Bell, User as UserIcon, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" replace />;
  
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-10 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <Link to="/dashboard" className="text-2xl font-black text-blue-600 tracking-tighter">FTracker</Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"><LayoutDashboard size={18} /> Dashboard</Link>
            <Link to="/categories" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"><ListTree size={18} /> Categories</Link>
            <Link to="/budgets" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"><PieChart size={18} /> Budgets</Link>
            <Link to="/transactions" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"><ReceiptText size={18} /> Transactions</Link>
            <Link to="/reports" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"><PieChart size={18} /> Reports</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-all">
              <Bell size={20} />
            </Link>
            <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
              <UserIcon size={18} className="text-gray-400" />
              <span className="text-sm font-bold">{user.name}</span>
            </Link>
          </div>
          <div className="h-8 w-px bg-gray-100"></div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href='/login'; }}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
