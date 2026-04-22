function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-hero-gradient py-12 text-center px-4">
        <h1 className="text-4xl font-display font-bold text-neutral-800">Terms & Conditions</h1>
        <p className="text-neutral-500 mt-2">Last updated: April 2026</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8 text-sm text-neutral-600 leading-relaxed">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing and using ArtisanHome, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.' },
            { title: '2. Products & Pricing', content: 'All prices are in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. We reserve the right to modify prices at any time without prior notice.' },
            { title: '3. Orders & Payment', content: 'Orders are confirmed once payment is successfully processed. We accept UPI, debit/credit cards, net banking, and cash on delivery. All transactions are secured with SSL encryption.' },
            { title: '4. Shipping Policy', content: 'We ship across India. Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days. Free shipping is available on orders above ₹2,000.' },
            { title: '5. Returns & Refunds', content: 'We offer a 30-day return policy for unused items in original condition. Refunds are processed within 5-7 business days after we receive the returned item.' },
            { title: '6. Intellectual Property', content: 'All content on ArtisanHome, including images, text, and logos, is the property of ArtisanHome and is protected by applicable intellectual property laws.' },
            { title: '7. Limitation of Liability', content: 'ArtisanHome shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.' },
            { title: '8. Governing Law', content: 'These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.' },
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

export default TermsPage;
