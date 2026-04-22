import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn.js';

const FAQS = [
  { q: 'What are your delivery timelines?', a: 'Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days. Same-day delivery is available in select cities.' },
  { q: 'Do you offer free shipping?', a: 'Yes! We offer free standard shipping on all orders above ₹2,000.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy. Products must be in original, unused condition with all packaging intact.' },
  { q: 'Are your products genuinely handmade?', a: 'Absolutely. Each product is handcrafted by our partner artisans using traditional techniques. Minor variations are a mark of authenticity.' },
  { q: 'How do I track my order?', a: 'Once your order is dispatched, you will receive an email with a tracking link. You can also track orders from your profile page.' },
  { q: 'Can I cancel my order?', a: 'You can cancel your order within 24 hours of placing it, or before it ships. Go to your profile > orders to cancel.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, debit/credit cards, net banking via Razorpay, and cash on delivery for orders below ₹10,000.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship within India only. International shipping is coming soon!' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-neutral-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-medium text-neutral-800 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

function FaqPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-hero-gradient py-16 text-center px-4">
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-3">Frequently Asked Questions</h1>
        <p className="text-neutral-500">Everything you need to know about ArtisanHome.</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-3">
        {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
      </div>
    </div>
  );
}

export default FaqPage;
