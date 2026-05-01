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
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: TrendingUp, title: 'Track Expenses', desc: 'Monitor every cent with automated categorization.' },
    { icon: PieChart, title: 'Smart Budgets', desc: 'Set monthly limits and stay disciplined with your goals.' },
    { icon: Bell, title: 'Instant Alerts', desc: 'Get notified immediately when you exceed your limits.' },
    { icon: ShieldCheck, title: 'Secure & Private', desc: 'Your financial data is encrypted and protected.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side: Landing Content */}
      <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 space-y-8">
          <div>
            <span className="bg-blue-500 text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-blue-400">Next Gen Finance</span>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mt-6 leading-tight">
              Master your money <br/> with <span className="text-blue-200">FTracker.</span>
            </h1>
            <p className="text-xl text-blue-100 mt-6 max-w-lg font-medium leading-relaxed">
              The minimalist personal finance tracker designed for clarity, speed, and total control over your financial future.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
            {features.map((f, i) => (
              <div key={i} className="space-y-3">
                <div className="p-3 bg-white/10 w-fit rounded-xl backdrop-blur-sm border border-white/10">
                  <f.icon size={24} />
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-blue-100/70 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-gray-500 font-medium mt-2">
              {isLogin ? 'Log in to your dashboard to continue.' : 'Join FTracker and start tracking today.'}
            </p>
          </div>

          <div className="card p-8 shadow-xl shadow-gray-200/50 border-none">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="John Doe"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required={!isLogin} 
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="name@company.com"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-4 text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Get Started')}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Demo Access</p>
                <button 
                  onClick={handleDemoLogin}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <UserCheck size={18} />
                  Use Demo Account
                </button>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                Experience the full power of FTracker instantly. No registration required for the demo.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-gray-500 font-bold hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-blue-600 underline underline-offset-4 decoration-2">{isLogin ? 'Register now' : 'Login here'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
