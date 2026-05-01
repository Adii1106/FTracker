import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  
  return (
    <div>
      <nav className="bg-white border-b px-6 py-4 flex gap-4">
        <span className="font-bold mr-4">FTracker</span>
        <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link to="/categories" className="text-blue-600 hover:underline">Categories</Link>
        <Link to="/budgets" className="text-blue-600 hover:underline">Budgets</Link>
        <Link to="/transactions" className="text-blue-600 hover:underline">Transactions</Link>
        <Link to="/reports" className="text-blue-600 hover:underline">Reports</Link>
        <Link to="/notifications" className="text-blue-600 hover:underline">Notifications</Link>
        <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
        <button 
          onClick={() => { localStorage.clear(); window.location.href='/login'; }}
          className="text-red-600 hover:underline ml-auto"
        >
          Logout
        </button>
      </nav>
      <div className="p-6">
        {children}
      </div>
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
