import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { label: 'Living Room', to: '/products?category=living-room' },
  { label: 'Bedroom', to: '/products?category=bedroom' },
  { label: 'Kitchen', to: '/products?category=kitchen' },
  { label: 'Bathroom', to: '/products?category=bathroom' },
  { label: 'Garden', to: '/products?category=garden' },
  { label: 'Lighting', to: '/products?category=lighting' },
];

const QUICK_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Shipping Policy', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms & Conditions', to: '/terms' },
];

const SOCIAL_LINKS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-warm-gradient rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Artisan<span className="text-primary-400">Home</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400 mb-6">
              Curating beautiful, handcrafted home decor pieces that transform your living spaces
              into warm, inspiring sanctuaries.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.to}
                    className="text-sm text-neutral-400 hover:text-primary-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Get In Touch
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-400">
                  123 Artisan Lane, Bandra West, Mumbai 400050
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-neutral-400 hover:text-primary-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:hello@artisanhome.in" className="text-sm text-neutral-400 hover:text-primary-400 transition-colors">
                  hello@artisanhome.in
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Newsletter</h4>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-neutral-500 mt-2">
                Get exclusive deals and home decor inspiration.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} ArtisanHome. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors">
              Terms
            </Link>
            <span className="text-xs text-neutral-500">
              Made with love in India 🇮🇳
            </span>
          </div>
          {/* Payment Icons Placeholder */}
          <div className="flex items-center gap-2">
            {['Visa', 'MC', 'UPI', 'GPay'].map((pay) => (
              <span
                key={pay}
                className="px-2 py-1 text-xs bg-neutral-800 text-neutral-400 rounded border border-neutral-700"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
