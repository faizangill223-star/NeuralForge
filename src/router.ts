import { useState, useEffect, useCallback } from 'react';

export type Route =
  | '/'
  | '/dashboard'
  | '/models'
  | '/about'
  | '/pricing'
  | '/checkout'
  | '/premium-dashboard'
  | '/admin-noman'
  | '/signup'
  | '/contact';

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  function parseHash(): Route {
    const hash = window.location.hash.replace('#', '') || '/';
    const validRoutes: Route[] = [
      '/',
      '/dashboard',
      '/models',
      '/about',
      '/pricing',
      '/checkout',
      '/premium-dashboard',
      '/admin-noman',
      '/signup',
      '/contact',
    ];
    return validRoutes.includes(hash as Route) ? (hash as Route) : '/';
  }

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((to: Route) => {
    window.location.hash = to;
  }, []);

  return { route, navigate };
}
