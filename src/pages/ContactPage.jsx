import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { contactSchema } from '@/utils/validators.js';
import Input, { Textarea } from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import toast from 'react-hot-toast';

function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Your message has been sent! We\'ll get back to you shortly.');
    reset();
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-hero-gradient py-16 px-4 text-center">
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-3">Get In Touch</h1>
        <p className="text-neutral-500 max-w-lg mx-auto">
          Have a question or need help? Our team is here for you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">Contact Information</h2>
            <div className="space-y-5 mb-10">
              {[
                { icon: MapPin, title: 'Visit Us', info: '123 Artisan Lane, Bandra West, Mumbai 400050' },
                { icon: Phone, title: 'Call Us', info: '+91 98765 43210', link: 'tel:+919876543210' },
                { icon: Mail, title: 'Email Us', info: 'hello@artisanhome.in', link: 'mailto:hello@artisanhome.in' },
                { icon: Clock, title: 'Business Hours', info: 'Mon - Sat: 10AM - 7PM IST' },
              ].map(({ icon: Icon, title, info, link }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800 text-sm">{title}</p>
                    {link ? (
                      <a href={link} className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{info}</a>
                    ) : (
                      <p className="text-sm text-neutral-600">{info}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-neutral-100 rounded-2xl h-48 flex items-center justify-center text-neutral-400">
              <MapPin className="w-8 h-8" />
              <span className="ml-2 text-sm">Map placeholder</span>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Your Name" required placeholder="John Doe" error={errors.name?.message} {...register('name')} />
                <Input label="Email Address" type="email" required placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                <Input label="Subject" required placeholder="How can we help?" error={errors.subject?.message} {...register('subject')} />
                <Textarea label="Message" required placeholder="Tell us more..." rows={5} error={errors.message?.message} {...register('message')} />
                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
