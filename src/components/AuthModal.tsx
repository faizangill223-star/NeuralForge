import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useRouter } from '../router';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ open, onClose, initialMode = 'signin' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const { navigate } = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccess(null);
  }, [initialMode, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        if (error.includes('already')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(error);
        }
      } else {
        setSuccess('Account created successfully! You are now signed in.');
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 1200);
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setError('Invalid email or password. Please try again.');
      } else {
        setSuccess('Sign in successful! Redirecting to your dashboard...');
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 1000);
      }
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="glass-strong rounded-2xl p-8 shadow-2xl border border-neutral-700/50">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 mb-4 shadow-lg shadow-primary-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-neutral-400">
              {mode === 'signin'
                ? 'Sign in to access your NeuralForge dashboard'
                : 'Start generating intelligent content in seconds'}
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-5 px-3 py-2 rounded-lg bg-primary-500/5 border border-primary-500/15 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-primary-400 shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Use any email and a 6+ character password. New accounts are created instantly — no email confirmation required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Jane Developer"
                    className="input-field w-full pl-10 pr-4 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-field w-full pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field w-full pl-10 pr-10 py-2.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-error-500/10 border border-error-500/20 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-error-400 shrink-0 mt-0.5" />
                <p className="text-xs text-error-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-success-500/10 border border-success-500/20 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />
                <p className="text-xs text-success-400">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-xs text-neutral-600">or</span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>

          {/* Social buttons (demo) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="btn-ghost py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </button>
            <button
              type="button"
              className="btn-ghost py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <Chrome className="w-4 h-4" />
              Google
            </button>
          </div>

          {/* Switch mode */}
          <p className="text-center text-sm text-neutral-400 mt-6">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={switchMode} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function Github({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function Chrome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c2.9 0 5.45 1.55 6.84 3.86L12 12 5.16 7.86C6.55 5.55 9.1 4 12 4zm-8 8c0-1.1.18-2.15.52-3.13L8 12l-3.48 3.13C4.18 14.15 4 13.1 4 12zm8 8c-2.9 0-5.45-1.55-6.84-3.86L12 12l6.84 4.14C17.45 18.45 14.9 20 12 20zm7.48-4.87L16 12l3.48-3.13C19.82 9.85 20 10.9 20 12s-.18 2.15-.52 3.13z" />
    </svg>
  );
}
