import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from './supabase';

export interface AppSettings {
  payment_gateway_url: string;
  gumroad_link: string;
  easypaisa_details: string;
  jazzcash_details: string;
  bank_account_details: string;
  openai_api_key: string;
  gemini_api_key: string;
  whatsapp_number: string;
  contact_email: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  payment_gateway_url: '',
  gumroad_link: '',
  easypaisa_details: '',
  jazzcash_details: '',
  bank_account_details: '',
  openai_api_key: '',
  gemini_api_key: '',
  whatsapp_number: '923000000000',
  contact_email: 'support@neuralforge.io',
};

interface SettingsContextValue {
  settings: AppSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSettings({
          payment_gateway_url: data.payment_gateway_url || '',
          gumroad_link: data.gumroad_link || '',
          easypaisa_details: data.easypaisa_details || '',
          jazzcash_details: data.jazzcash_details || '',
          bank_account_details: data.bank_account_details || '',
          openai_api_key: data.openai_api_key || '',
          gemini_api_key: data.gemini_api_key || '',
          whatsapp_number: data.whatsapp_number || '923000000000',
          contact_email: data.contact_email || 'support@neuralforge.io',
        });
      }
    } catch (err) {
      console.error('Failed to load app settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
