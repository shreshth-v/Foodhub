import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, KeyRound, Mail, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isOwner } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fromPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      toast.success('Logged in successfully!');
      if (result.user?.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate(fromPath);
      }
    } catch (err) {
      toast.error(err || 'Invalid email or password');
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6 glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-500/20">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to order food or manage your restaurant</p>
        </div>

        {/* Demo Credentials Quick-Fill Cards */}
        <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Quick Login (Password: password123)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('customer@foodhub.com')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/60 transition-colors"
            >
              <span className="text-xs font-bold text-white block">Customer</span>
              <span className="text-[10px] text-slate-400 block truncate">customer@foodhub.com</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('owner@foodhub.com')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/60 transition-colors"
            >
              <span className="text-xs font-bold text-rose-400 block">Owner</span>
              <span className="text-[10px] text-slate-400 block truncate">owner@foodhub.com</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 brand-gradient text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-transform active:scale-95 mt-2"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-rose-400 font-bold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
