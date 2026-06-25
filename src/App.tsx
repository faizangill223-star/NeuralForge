import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import RouteGuard from './components/RouteGuard';
import { AuthProvider } from './lib/auth';
import { AuthModalProvider } from './components/AuthModalContext';
import { SettingsProvider } from './lib/settings';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ModelsPage from './pages/ModelsPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import PremiumDashboardPage from './pages/PremiumDashboardPage';
import AdminPage from './pages/AdminPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import { useRouter } from './router';

function App() {
  const { route } = useRouter();

  const renderPage = () => {
    switch (route) {
      case '/':
        return <HomePage />;
      case '/dashboard':
        return (
          <RouteGuard requireAuth redirectTo="/signup">
            <DashboardPage />
          </RouteGuard>
        );
      case '/models':
        return (
          <RouteGuard requireAuth redirectTo="/signup">
            <ModelsPage />
          </RouteGuard>
        );
      case '/pricing':
        return <PricingPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/premium-dashboard':
        return (
          <RouteGuard requireAuth requirePremium>
            <PremiumDashboardPage />
          </RouteGuard>
        );
      case '/admin-noman':
        return <AdminPage />;
      case '/signup':
        return <SignupPage />;
      default:
        return <HomePage />;
    }
  };

  const isLanding = route === '/' || route === '/about' || route === '/pricing' || route === '/contact';
  const hideChrome = route === '/admin-noman' || route === '/signup' || route === '/checkout';

  return (
    <SettingsProvider>
      <AuthProvider>
        <AuthModalProvider>
          <div className="min-h-screen flex flex-col bg-neutral-950">
            {!hideChrome && <Navbar />}
            <main className="flex-1 animate-fade-in" key={route}>
              {renderPage()}
            </main>
            {isLanding && <Footer />}
            <WhatsAppButton />
          </div>
        </AuthModalProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
