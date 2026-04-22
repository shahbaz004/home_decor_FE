import { motion } from 'framer-motion';
import { Heart, Award, Users, Globe } from 'lucide-react';

function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-hero-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-display font-bold text-neutral-800 mb-5">
              Our <span className="text-gradient">Story</span>
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              ArtisanHome was born from a deep love of craftsmanship and a belief that every home
              deserves to be filled with beautiful, meaningful objects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">Our Mission</span>
            <h2 className="text-4xl font-display font-bold text-neutral-800 mt-3 mb-5">
              Bringing Artisanal Beauty to Every Home
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-5">
              Founded in 2020, ArtisanHome works directly with skilled artisans across India to
              bring you handcrafted home decor that tells a story. Each piece is made with love,
              traditional techniques, and sustainable materials.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              We believe that your home should be a reflection of who you are — warm, unique,
              and filled with character. That's why every product we curate is chosen for its
              beauty, quality, and the story behind it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://picsum.photos/seed/about1/300/350" alt="Artisan at work" className="rounded-2xl object-cover w-full h-52 mt-8" />
            <img src="https://picsum.photos/seed/about2/300/350" alt="Handcrafted decor" className="rounded-2xl object-cover w-full h-52" />
            <img src="https://picsum.photos/seed/about3/300/350" alt="Home styling" className="rounded-2xl object-cover w-full h-40 col-span-2" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, num: '5,000+', label: 'Happy Customers' },
            { icon: Heart, num: '200+', label: 'Artisan Partners' },
            { icon: Award, num: '500+', label: 'Curated Products' },
            { icon: Globe, num: '20+', label: 'States Served' },
          ].map(({ icon: Icon, num, label }) => (
            <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-3xl font-display font-bold text-neutral-800">{num}</p>
              <p className="text-sm text-neutral-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-neutral-800">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Authenticity', desc: 'Every product is genuinely handcrafted and tells the story of the artisan who made it.' },
              { title: 'Sustainability', desc: 'We use natural materials and support eco-friendly practices at every step of our supply chain.' },
              { title: 'Community', desc: 'We empower local artisans by providing fair wages and global market access for their craft.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-primary-50 rounded-2xl p-6">
                <h3 className="font-serif font-bold text-neutral-800 text-lg mb-2">{title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
