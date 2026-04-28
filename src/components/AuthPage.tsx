import React, { useState } from 'react';
import { useAuth } from '../store/authStore';
import { LogIn, UserPlus, Key, Mail, Shield, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

type Mode = 'login' | 'register' | 'otp';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email) { setError('Please enter your email.'); return; }

    setSubmitting(true);

    if (mode === 'login') {
      if (!password) { setError('Please enter your password.'); setSubmitting(false); return; }
      const { error: err } = await login(email, password);
      if (err) setError(err);
    }

    if (mode === 'register') {
      if (!password) { setError('Please enter a password.'); setSubmitting(false); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); setSubmitting(false); return; }
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) setError(err.message);
      else setInfo('Check your email for a confirmation link to activate your account.');
    }

    if (mode === 'otp') {
      const { error: err } = await supabase.auth.signInWithOtp({ email });
      if (err) setError(err.message);
      else setInfo('Magic link sent! Check your email to sign in.');
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-primary mb-4">
              <div className="w-6 h-6 rounded-[6px] border-[3px] border-white"></div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create an account' : 'Magic Link Login'}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {mode === 'login'
                ? 'Enter your credentials to access the AIBoard dashboard.'
                : mode === 'register'
                ? 'Sign up to start configuring your AI assistant.'
                : 'We will send a magic link to your email.'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100 font-medium text-center"
            >
              {error}
            </motion.div>
          )}
          {info && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-6 border border-green-100 font-medium text-center"
            >
              {info}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900"
                placeholder="you@example.com"
              />
            </div>

            <AnimatePresence>
              {(mode === 'login' || mode === 'register') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-slate-400" />
                      Password
                    </div>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('otp')}
                        className="text-primary hover:underline text-xs font-medium"
                      >
                        Use magic link instead
                      </button>
                    )}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900"
                    placeholder="••••••••"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Key className="w-4 h-4 text-slate-400" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900"
                    placeholder="••••••••"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md mt-6 flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              {submitting
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Shield className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              }
              {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Magic Link'}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm text-slate-500 font-medium">
            {mode !== 'login' && (
              <button onClick={() => setMode('login')} className="text-primary hover:underline font-bold">
                Back to Login
              </button>
            )}
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-primary hover:underline font-bold">
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center text-xs text-slate-400 font-medium">
          Protected by Supabase Auth
        </div>
      </motion.div>
    </div>
  );
}
