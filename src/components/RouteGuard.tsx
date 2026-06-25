import { type ReactNode, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter, type Route } from '../router';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requirePremium?: boolean;
  redirectTo?: Route;
}

export default function RouteGuard({
  children,
  requireAuth = false,
  requirePremium = false,
  redirectTo = '/signup',
}: RouteGuardProps) {
  const { user, isPremium, loading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      navigate(redirectTo);
      return;
    }

    if (requirePremium && !isPremium) {
      navigate('/pricing');
      return;
    }
  }, [user, isPremium, loading, requireAuth, requirePremium, redirectTo, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) return null;
  if (requirePremium && !isPremium) return null;

  return <>{children}</>;
}
