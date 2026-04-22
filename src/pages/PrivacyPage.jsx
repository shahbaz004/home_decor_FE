function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-hero-gradient py-12 text-center px-4">
        <h1 className="text-4xl font-display font-bold text-neutral-800">Privacy Policy</h1>
        <p className="text-neutral-500 mt-2">Last updated: April 2026</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8 text-sm text-neutral-600 leading-relaxed">
          {[
            { title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, and delivery address.' },
            { title: '2. How We Use Your Information', content: 'We use the information we collect to process orders, send order confirmations and updates, communicate with you about our products and services, and improve our platform.' },
            { title: '3. Information Sharing', content: 'We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our platform, processing payments, and delivering orders.' },
            { title: '4. Data Security', content: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All payment information is encrypted using SSL technology.' },
            { title: '5. Cookies', content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve your experience.' },
            { title: '6. Contact Us', content: 'If you have questions about this Privacy Policy, please contact us at privacy@artisanhome.in or write to us at 123 Artisan Lane, Mumbai 400050.' },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-serif font-bold text-neutral-800 text-lg mb-3">{title}</h2>
              <p>{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;
