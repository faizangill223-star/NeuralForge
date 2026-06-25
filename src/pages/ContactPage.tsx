import { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../lib/settings';

export default function ContactPage() {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto pt-12 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">Contact & Support</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Get in <span className="gradient-text">touch</span>
          </h1>
          <p className="text-neutral-400 text-lg">
            Have a question, feature request, or need support? Send us a message and we will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-white text-sm mb-1">Email Support</h3>
              <p className="text-xs text-neutral-500 mb-2">For general inquiries and support</p>
              <a href={`mailto:${settings.contact_email}`} className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                {settings.contact_email}
              </a>
            </div>

            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-secondary-500/10 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-secondary-400" />
              </div>
              <h3 className="font-display font-semibold text-white text-sm mb-1">WhatsApp</h3>
              <p className="text-xs text-neutral-500 mb-2">Quick chat for urgent matters</p>
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-secondary-400 hover:text-secondary-300 transition-colors"
              >
                +{settings.whatsapp_number}
              </a>
            </div>

            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-accent-400" />
              </div>
              <h3 className="font-display font-semibold text-white text-sm mb-1">Response Time</h3>
              <p className="text-xs text-neutral-500 mb-2">We typically reply within</p>
              <span className="text-sm text-white">A few hours (Mon-Fri)</span>
            </div>

            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-neutral-700/30 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-neutral-400" />
              </div>
              <h3 className="font-display font-semibold text-white text-sm mb-1">Headquarters</h3>
              <p className="text-xs text-neutral-500 mb-2">Remote-first, globally distributed</p>
              <span className="text-sm text-white">San Francisco, CA</span>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="font-display font-semibold text-white text-xl mb-1">Send a Message</h2>
              <p className="text-sm text-neutral-500 mb-6">Fill out the form below and we will respond as soon as possible.</p>

              {success && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-success-500/10 border border-success-500/20 mb-6 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-success-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-success-400 font-medium">Message sent successfully!</p>
                    <p className="text-xs text-neutral-400 mt-0.5">We have received your message and will get back to you shortly.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-error-500/10 border border-error-500/20 mb-6 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-error-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-error-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Developer"
                      className="input-field w-full px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="input-field w-full px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    className="input-field w-full px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Message *</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="input-field w-full px-4 py-3 text-sm resize-none scrollbar-thin"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-neutral-600">
                  Your message will be sent to our support team at {settings.contact_email}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
