import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle, X, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => void;
  onRegister: (email: string, pass: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        onLogin(email.trim(), password);
      } else {
        onRegister(email.trim(), password);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoDonor = () => {
    setEmail('rafiqul@example.com');
    setPassword('password123');
    setMode('login');
    setError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@bloodbond.org');
    setPassword('admin123password');
    setMode('login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {mode === 'login' ? 'Sign In to BloodBond' : 'Create Donor Account'}
              </h3>
              <p className="text-xs text-red-100">
                {mode === 'login' ? 'Access your private donor dashboard' : 'Join our emergency blood response network'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-red-600 outline-hidden"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm mt-2"
          >
            <span>{mode === 'login' ? 'Sign In Now' : 'Create My Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Credentials for Convenience */}
          <div className="pt-3 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 text-center">
              Quick Test Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={fillDemoDonor}
                className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 rounded-lg text-left transition-colors border border-gray-200"
              >
                <div className="font-bold">Demo Donor</div>
                <div className="text-[10px] text-gray-500">Dr. Rafiqul (O+)</div>
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 rounded-lg text-left transition-colors border border-gray-200"
              >
                <div className="font-bold">Demo Admin</div>
                <div className="text-[10px] text-gray-500">Admin Panel Access</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
