import { Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';
import { useRouter, type Route } from '../router';

export default function Footer() {
  const { navigate } = useRouter();

  const links: { title: string; items: { label: string; route?: Route }[] }[] = [
    {
      title: 'Product',
      items: [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'AI Models', route: '/models' },
        { label: 'Pricing', route: '/pricing' },
        { label: 'API Docs' },
      ],
    },
    {
      title: 'Company',
      items: [
        { label: 'About', route: '/about' },
        { label: 'Blog' },
        { label: 'Careers' },
        { label: 'Contact', route: '/contact' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { label: 'Documentation' },
        { label: 'Community' },
        { label: 'Status' },
        { label: 'Security' },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-neutral-800/50 mt-32">
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo className="w-9 h-9" />
              <span className="font-display font-bold text-xl text-white">
                Neural<span className="gradient-text">Forge</span>
              </span>
            </div>
            <p className="text-neutral-400 text-sm max-w-xs leading-relaxed mb-6">
              Enterprise-grade AI content generation, analytics, and model orchestration. Built for teams that ship at scale.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-primary-400 hover:border-primary-500/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {links.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => item.route && navigate(item.route)}
                      className="text-sm text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-1 group"
                    >
                      {item.label}
                      {item.route && (
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-600">
            © 2026 Noman Web Developer. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-neutral-600 hover:text-neutral-400 cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs text-neutral-600 hover:text-neutral-400 cursor-pointer transition-colors">Terms</span>
            <span className="text-xs text-neutral-600 hover:text-neutral-400 cursor-pointer transition-colors">Cookies</span>
            <div className="flex items-center gap-2">
              <span className="status-dot bg-success-500 animate-pulse" />
              <span className="text-xs text-neutral-500">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
