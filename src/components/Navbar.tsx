import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, LayoutDashboard, Cpu, Info, DollarSign, LogOut, User as UserIcon, Crown, MessageSquare } from 'lucide-react';
import { useRouter, type Route } from '../router';
import { useAuth } from '../lib/auth';
import { useAuthModal } from './AuthModalContext';
import Logo from './Logo';

const navItems: { label: string; route: Route; icon: typeof Menu }[] = [
  { label: 'Home', route: '/', icon: Sparkles },
  { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Models', route: '/models', icon: Cpu },
  { label: 'Pricing', route: '/pricing', icon: DollarSign },
  { label: 'About', route: '/about', icon: Info },
  { label: 'Contact', route: '/contact', icon: MessageSquare },
];

export default function Navbar() {
  const { route, navigate } = useRouter();
  const { user, isPremium, signOut } = useAuth();
  const { openAuth } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => handleNav('/')} className="flex items-center gap-2.5 group">
            <Logo className="w-8 h-8 transition-transform group-hover:scale-110" />
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Neural<span className="gradient-text">Forge</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = route === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`nav-link px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isPremium && (
                  <button
                    onClick={() => navigate('/premium-dashboard')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-500/15 to-secondary-500/15 border border-primary-500/25 text-xs font-medium text-primary-400 hover:from-primary-500/25 hover:to-secondary-500/25 transition-all"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Premium
                  </button>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-neutral-300 max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className="p-2 text-neutral-400 hover:text-error-400 transition-colors rounded-lg hover:bg-neutral-800/50"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuth('signin')}
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-4 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary px-5 py-2 rounded-lg text-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-neutral-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="md:hidden glass-strong border-t border-neutral-800/50 animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = route === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleNav(item.route)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary-500/10 text-primary-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-3 border-t border-neutral-800/50 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                        <UserIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      {user.email}
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        navigate('/');
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error-400 hover:bg-error-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        openAuth('signin');
                        setMobileOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm font-medium text-neutral-300 text-left"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signup');
                        setMobileOpen(false);
                      }}
                      className="btn-primary px-4 py-2.5 rounded-lg text-sm"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
