import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ShieldCheck, TrendingUp, PieChart, Bell, ArrowRight, UserCheck } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('password123');
    setIsLogin(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: TrendingUp, title: 'Track Expenses', desc: 'Monitor your spending automatically.' },
    { icon: PieChart, title: 'Smart Budgets', desc: 'Stay within your monthly limits.' },
    { icon: Bell, title: 'Instant Alerts', desc: 'Get notified of budget overruns.' },
    { icon: ShieldCheck, title: 'Secure Data', desc: 'Your data is safe and encrypted.' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* Left Side: Landing Content */}
      <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-blue-600 text-white">
        <div className="max-w-lg space-y-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Simple finance <br/> tracking with <span className="text-blue-200">FTracker.</span>
            </h1>
            <p className="text-lg text-blue-100 mt-4 font-medium leading-relaxed opacity-90">
              A minimalist tool designed for total control over your monthly budget and expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="mt-1">
                  <f.icon size={20} className="text-blue-200" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{f.title}</h3>
                  <p className="text-blue-100/60 text-xs mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {isLogin ? 'Sign In' : 'Join Now'}
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              {isLogin ? 'Access your financial dashboard.' : 'Start your journey with FTracker.'}
            </p>
          </div>

          <div className="card p-8 bg-white border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Name</label>
                  <input type="text" className="input-field py-2.5" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required={!isLogin} />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Email</label>
                <input type="email" className="input-field py-2.5" placeholder="name@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Password</label>
                <input type="password" className="input-field py-2.5" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button 
                onClick={handleDemoLogin}
                className="flex items-center justify-center gap-2 w-full text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-all"
              >
                <UserCheck size={16} />
                Use Demo Account
              </button>
            </div>
          </div>

          <div className="text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
              {isLogin ? 'New here? Register' : 'Existing user? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
