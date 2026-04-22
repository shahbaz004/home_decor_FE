import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForgotPasswordMutation } from '@/api/apiSlice.js';
import { forgotPasswordSchema } from '@/utils/validators.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import toast from 'react-hot-toast';

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      setSent(true);
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-warm-lg p-8"
        >
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-3">Check your inbox!</h2>
              <p className="text-neutral-500 text-sm mb-6">
                We've sent a password reset link to{' '}
                <strong>{getValues('email')}</strong>. It may take a minute to arrive.
              </p>
              <Link to="/login">
                <Button variant="outline" fullWidth leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary-600" />
                </div>
                <h1 className="text-2xl font-display font-bold text-neutral-800">Forgot Password?</h1>
                <p className="text-neutral-500 text-sm mt-2">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  required
                  {...register('email')}
                />
                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                  Send Reset Link
                </Button>
              </form>

              <p className="text-center text-sm text-neutral-500 mt-6">
                <Link to="/login" className="text-primary-600 hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
