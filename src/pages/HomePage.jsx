import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star, Shield, Truck, RefreshCcw, Headphones, ChevronRight } from 'lucide-react';
import { useGetFeaturedProductsQuery, useGetCategoriesQuery } from '@/api/apiSlice.js';
import ProductGrid from '@/components/products/ProductGrid.jsx';
import Button from '@/components/ui/Button.jsx';

const CATEGORIES_FALLBACK = [
  { id: 1, name: 'Living Room', slug: 'living-room', image: 'https://picsum.photos/seed/lr/400/300', productCount: 42 },
  { id: 2, name: 'Bedroom', slug: 'bedroom', image: 'https://picsum.photos/seed/bed/400/300', productCount: 38 },
  { id: 3, name: 'Kitchen', slug: 'kitchen', image: 'https://picsum.photos/seed/kit/400/300', productCount: 25 },
  { id: 4, name: 'Garden', slug: 'garden', image: 'https://picsum.photos/seed/gar/400/300', productCount: 19 },
  { id: 5, name: 'Lighting', slug: 'lighting', image: 'https://picsum.photos/seed/lig/400/300', productCount: 31 },
  { id: 6, name: 'Bathroom', slug: 'bathroom', image: 'https://picsum.photos/seed/bath/400/300', productCount: 17 },
];

const TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'Absolutely love my terracotta vase set! The quality is exceptional and delivery was super fast.', image: 'https://picsum.photos/seed/u1/60/60' },
  { id: 2, name: 'Rahul Mehta', city: 'Bengaluru', rating: 5, text: 'Transformed my living room completely. Every piece tells a story and feels artisanal.', image: 'https://picsum.photos/seed/u2/60/60' },
  { id: 3, name: 'Anjali Patel', city: 'Delhi', rating: 5, text: 'Beautiful packaging, gorgeous products. My home feels like a warm sanctuary now.', image: 'https://picsum.photos/seed/u3/60/60' },
];

const WHY_US = [
  { icon: Shield, title: 'Quality Assured', desc: 'Every product handpicked and quality-tested before dispatch.' },
  { icon: Truck, title: 'Free Shipping', desc: 'Complimentary shipping on all orders above ₹2,000.' },
  { icon: RefreshCcw, title: 'Easy Returns', desc: '30-day hassle-free return policy on all products.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our decor experts are always here to help you.' },
];

function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProductsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();

  const featuredProducts = featuredData?.results || featuredData || [];
  const categories = categoriesData?.results || categoriesData || CATEGORIES_FALLBACK;

  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-hero-gradient overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-terracotta-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-primary-200 rounded-full opacity-30 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-terracotta-100 text-terracotta-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            >
              New Collection 2026
            </motion.span>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-neutral-800 leading-tight mb-6">
              Your Home,{' '}
              <span className="text-gradient">Your Story</span>
            </h1>

            <p className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-lg">
              Discover handcrafted home decor pieces that bring warmth, character,
              and timeless beauty to every corner of your living space.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/products')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-warm"
              >
                Shop Collection
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
                Our Story
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { num: '5,000+', label: 'Happy Customers' },
                { num: '500+', label: 'Curated Products' },
                { num: '4.9★', label: 'Average Rating' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold font-serif text-neutral-800">{num}</p>
                  <p className="text-sm text-neutral-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Images */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://picsum.photos/seed/hero1/350/450"
                alt="Beautiful home decor"
                className="rounded-2xl shadow-warm-lg object-cover w-full h-72 mt-12"
              />
              <img
                src="https://picsum.photos/seed/hero2/350/450"
                alt="Artisan crafts"
                className="rounded-2xl shadow-warm-lg object-cover w-full h-56"
              />
              <img
                src="https://picsum.photos/seed/hero3/350/250"
                alt="Home styling"
                className="rounded-2xl shadow-sm object-cover w-full h-40 col-span-2"
              />
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -left-6 top-1/3 bg-white rounded-2xl shadow-warm p-4 max-w-[160px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-neutral-800">4.9/5</span>
              </div>
              <p className="text-xs text-neutral-500">Based on 1,200+ reviews</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-neutral-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Categories Section ─────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">Browse By Room</span>
              <h2 className="text-4xl font-display font-bold text-neutral-800 mt-2">
                Shop by Category
              </h2>
              <p className="text-neutral-500 mt-3 max-w-xl mx-auto">
                Find the perfect pieces for every room in your home.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat, i) => (
              <FadeInSection key={cat.id || cat.slug} delay={i * 0.05}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-neutral-50 shadow-sm group-hover:shadow-warm transition-all duration-300 group-hover:-translate-y-1">
                    <img
                      src={cat.image || `https://picsum.photos/seed/${cat.slug}/300/300`}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{cat.product_count || cat.productCount || '20+'} items</p>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">Handpicked For You</span>
                <h2 className="text-4xl font-display font-bold text-neutral-800 mt-2">
                  Featured Products
                </h2>
              </div>
              <Link
                to="/products"
                className="hidden sm:flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeInSection>

          <ProductGrid
            products={featuredProducts}
            isLoading={featuredLoading}
            columns={4}
          />

          <div className="text-center mt-10 sm:hidden">
            <Link to="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Banner / CTA ─────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/banner/1200/500"
            alt="Home decor banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <span className="text-sm text-amber-300 font-medium uppercase tracking-wider">Limited Time Offer</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
              Up to 40% Off on<br />Selected Items
            </h2>
            <p className="text-lg text-neutral-300 mb-8 max-w-lg mx-auto">
              Transform your home with our curated sale collection. Artisanal pieces at unbeatable prices.
            </p>
            <Button size="lg" variant="warm" onClick={() => navigate('/products?sale=true')}>
              Shop the Sale →
            </Button>
          </FadeInSection>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">Our Promise</span>
              <h2 className="text-4xl font-display font-bold text-neutral-800 mt-2">
                Why Choose ArtisanHome?
              </h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <FadeInSection key={title} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-50 hover:bg-primary-50 transition-colors duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-serif font-bold text-neutral-800 mb-2">{title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">Customer Love</span>
              <h2 className="text-4xl font-display font-bold text-neutral-800 mt-2">
                What Our Customers Say
              </h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeInSection key={t.id} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-warm transition-shadow duration-300">
                  <div className="flex mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-neutral-800 text-sm">{t.name}</p>
                      <p className="text-xs text-neutral-400">{t.city}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter Section ──────────────────────────── */}
      <section className="py-20 bg-warm-gradient">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="text-3xl font-display font-bold text-white mb-3">
              Get Inspired Every Week
            </h2>
            <p className="text-primary-100 mb-8">
              Subscribe to our newsletter for home styling tips, new arrivals, and exclusive offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                import('react-hot-toast').then(({ default: toast }) =>
                  toast.success('Thanks for subscribing!')
                );
              }}
              className="flex gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-transparent focus:border-white/30 bg-white/20 text-white placeholder:text-primary-200 focus:outline-none backdrop-blur-sm"
              />
              <Button type="submit" variant="secondary" size="md">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-primary-200 mt-3">
              No spam, ever. Unsubscribe anytime.
            </p>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
