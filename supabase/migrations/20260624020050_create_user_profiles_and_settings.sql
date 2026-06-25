/*
# Create user_profiles, app_settings, and contact_messages tables

1. New Tables
- `user_profiles`: Stores extended user data (full name, premium status, signup date) linked to auth.users.
- `app_settings`: Single-row table for admin-controlled application configuration (payment links, API keys, WhatsApp number, contact email).
- `contact_messages`: Stores contact form submissions from users.

2. Security
- `user_profiles`: RLS enabled. Users can read/update their own profile. Admins (service role) can read/update all.
- `app_settings`: RLS enabled. Readable by all (anon + authenticated) so the frontend can load payment links. Only service role (admin) can write.
- `contact_messages`: RLS enabled. Anyone can insert (contact form). Only service role (admin) can read/delete.

3. Important Notes
- `user_profiles.user_id` has DEFAULT auth.uid() so inserts from authenticated sessions auto-populate the owner.
- `app_settings` is a singleton — enforced by a CHECK constraint on id = 1.
- A trigger auto-creates a user_profile row when a new auth user is created.
*/

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  is_premium boolean NOT NULL DEFAULT false,
  signup_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- App settings table (singleton)
CREATE TABLE IF NOT EXISTS app_settings (
  id integer PRIMARY KEY DEFAULT 1,
  payment_gateway_url text DEFAULT '',
  gumroad_link text DEFAULT '',
  easypaisa_details text DEFAULT '',
  jazzcash_details text DEFAULT '',
  bank_account_details text DEFAULT '',
  openai_api_key text DEFAULT '',
  gemini_api_key text DEFAULT '',
  whatsapp_number text DEFAULT '923000000000',
  contact_email text DEFAULT 'support@neuralforge.io',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_check CHECK (id = 1)
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (payment links, WhatsApp number are public-facing)
DROP POLICY IF EXISTS "read_app_settings" ON app_settings;
CREATE POLICY "read_app_settings" ON app_settings FOR SELECT
  TO anon, authenticated USING (true);

-- Only service role can write (admin panel uses service role via edge function)
-- No INSERT/UPDATE/DELETE policy for anon/authenticated = locked down

-- Insert default row
INSERT INTO app_settings (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
DROP POLICY IF EXISTS "insert_contact_messages" ON contact_messages;
CREATE POLICY "insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only service role can read/delete (admin)

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
