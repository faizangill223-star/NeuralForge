import { useState } from 'react';
import {
  CreditCard,
  Lock,
  Shield,
  Check,
  Loader2,
  ArrowLeft,
  Zap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Building2,
  Smartphone,
} from 'lucide-react';
import { useRouter } from '../router';
import { useAuth } from '../lib/auth';
import { useSettings } from '../lib/settings';
import Logo from '../components/Logo';

type CheckoutStep = 'form' | 'processing' | 'success';

export default function CheckoutPage() {
  const { navigate } = useRouter();
  const { grantPremium } = useAuth();
  const { settings } = useSettings();
  const [step, setStep] = useState<CheckoutStep>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processingStage, setProcessingStage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasExternalPayment = settings.payment_gateway_url || settings.gumroad_link;

  const plan = {
    name: 'Pro Plan',
    price: 42,
    period: 'month',
    features: [
      'Unlimited AI content generation',
      'Access to all model providers',
      'Real-time analytics dashboard',
      'Custom pipeline builder',
      'Priority support & SLA',
      'Advanced RAG infrastructure',
      '10 team seats included',
      'Full API access',
    ],
  };

  const tax = Math.round(plan.price * 0.08 * 100) / 100;
  const total = plan.price + tax;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!cardName.trim()) e.cardName = 'Enter the cardholder name';
    if (expiry.length < 5) e.expiry = 'Enter a valid expiry date (MM/YY)';
    if (cvc.length < 3) e.cvc = 'Enter a valid CVC';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStep('processing');

    const stages = [
      'Encrypting payment data...',
      'Verifying card details...',
      'Contacting payment gateway...',
      'Authorizing transaction...',
      'Activating your Pro subscription...',
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    grantPremium();
    setStep('success');

    setTimeout(() => {
      navigate('/premium-dashboard');
    }, 2500);
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Processing Payment</h2>
          <p className="text-neutral-400 text-sm mb-6">Please do not close this window while we process your transaction.</p>

          <div className="glass rounded-xl p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-sm text-primary-400">
              <Shield className="w-4 h-4" />
              <span className="font-mono">{processingStage}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700"
              style={{ width: '85%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-success-500 to-secondary-600 mb-8 shadow-lg shadow-success-500/30">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Payment Successful!</h2>
          <p className="text-neutral-400 text-lg mb-2">Your Pro subscription is now active.</p>
          <p className="text-neutral-500 text-sm mb-8">Redirecting you to your premium dashboard...</p>

          <div className="glass rounded-xl p-4 flex items-center justify-center gap-2 text-sm text-success-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading premium features...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pricing
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-800">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg">NeuralForge Pro</h3>
                  <p className="text-xs text-neutral-500">Premium subscription plan</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-6 border-t border-neutral-800">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-neutral-200 font-mono">${plan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Tax (8%)</span>
                  <span className="text-neutral-200 font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-800 mt-2">
                  <span className="font-display font-semibold text-white">Total</span>
                  <div className="text-right">
                    <span className="font-display text-2xl font-bold text-white">${total.toFixed(2)}</span>
                    <span className="text-neutral-500 text-sm">/{plan.period}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-neutral-900/50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400 shrink-0" />
                <p className="text-xs text-neutral-400">Cancel anytime. No hidden fees, no contracts.</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Logo className="w-8 h-8" />
                <div>
                  <h2 className="font-display font-bold text-white text-xl">Secure Checkout</h2>
                  <p className="text-xs text-neutral-500">Complete your subscription upgrade</p>
                </div>
              </div>

              {/* Security badge */}
              <div className="mb-6 p-3 rounded-lg bg-success-500/5 border border-success-500/15 flex items-center gap-2">
                <Lock className="w-4 h-4 text-success-400 shrink-0" />
                <p className="text-xs text-neutral-400">
                  Your payment is encrypted with 256-bit SSL. This is a simulated transaction — no real charges will be made.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Card Number */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className={`input-field w-full pl-10 pr-4 py-3 text-sm font-mono ${errors.cardNumber ? 'border-error-500/50' : ''}`}
                    />
                  </div>
                  {errors.cardNumber && <p className="text-xs text-error-400 mt-1">{errors.cardNumber}</p>}
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Jane Developer"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={`input-field w-full px-4 py-3 text-sm ${errors.cardName ? 'border-error-500/50' : ''}`}
                  />
                  {errors.cardName && <p className="text-xs text-error-400 mt-1">{errors.cardName}</p>}
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Expiry Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className={`input-field w-full pl-10 pr-4 py-3 text-sm font-mono ${errors.expiry ? 'border-error-500/50' : ''}`}
                      />
                    </div>
                    {errors.expiry && <p className="text-xs text-error-400 mt-1">{errors.expiry}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">CVC</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className={`input-field w-full pl-10 pr-4 py-3 text-sm font-mono ${errors.cvc ? 'border-error-500/50' : ''}`}
                      />
                    </div>
                    {errors.cvc && <p className="text-xs text-error-400 mt-1">{errors.cvc}</p>}
                  </div>
                </div>

                {/* External payment options (admin-configured) */}
                {hasExternalPayment && (
                  <div className="space-y-3 p-4 rounded-xl bg-primary-500/5 border border-primary-500/15">
                    <p className="text-xs font-medium text-primary-400 uppercase tracking-wider">Alternative Payment Methods</p>
                    {settings.gumroad_link && (
                      <a
                        href={settings.gumroad_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-accent-400" />
                          </div>
                          <div>
                            <div className="text-sm text-white font-medium">Pay via Gumroad</div>
                            <div className="text-xs text-neutral-500">Secure external checkout</div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                      </a>
                    )}
                    {settings.payment_gateway_url && (
                      <a
                        href={settings.payment_gateway_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-primary-400" />
                          </div>
                          <div>
                            <div className="text-sm text-white font-medium">Pay via Payment Gateway</div>
                            <div className="text-xs text-neutral-500">Stripe / external gateway</div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                      </a>
                    )}
                  </div>
                )}

                {/* Manual payment details (admin-configured) */}
                {(settings.easypaisa_details || settings.jazzcash_details || settings.bank_account_details) && (
                  <div className="space-y-3 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Manual Payment Options</p>
                    <p className="text-xs text-neutral-500">Send payment to any of the methods below, then contact us to activate your Pro account.</p>
                    {settings.easypaisa_details && (
                      <div className="p-3 rounded-lg bg-neutral-900/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Smartphone className="w-3.5 h-3.5 text-secondary-400" />
                          <span className="text-xs font-medium text-secondary-400">EasyPaisa</span>
                        </div>
                        <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-mono">{settings.easypaisa_details}</pre>
                      </div>
                    )}
                    {settings.jazzcash_details && (
                      <div className="p-3 rounded-lg bg-neutral-900/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Smartphone className="w-3.5 h-3.5 text-accent-400" />
                          <span className="text-xs font-medium text-accent-400">JazzCash</span>
                        </div>
                        <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-mono">{settings.jazzcash_details}</pre>
                      </div>
                    )}
                    {settings.bank_account_details && (
                      <div className="p-3 rounded-lg bg-neutral-900/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-3.5 h-3.5 text-primary-400" />
                          <span className="text-xs font-medium text-primary-400">Bank Transfer</span>
                        </div>
                        <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-mono">{settings.bank_account_details}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Billing note */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-neutral-900/50">
                  <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    This is a simulated checkout — use any card details to simulate the payment, or use the alternative payment methods above if configured by the admin.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Pay ${total.toFixed(2)} & Activate Pro
                </button>

                <p className="text-center text-xs text-neutral-600 flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Secured by NeuralForge Payment Gateway
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
