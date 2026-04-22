import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';
import { useResetPasswordMutation } from '@/api/apiSlice.js';
import { resetPasswordSchema } from '@/utils/validators.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import toast from 'react-hot-toast';

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [resetPassword] = useResetPasswordMutation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword({ ...data, token }).unwrap();
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to reset password. Link may be expired.');
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
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-3">Password Reset!</h2>
              <p className="text-neutral-500 text-sm mb-6">
                Your password has been updated. Redirecting to login...
              </p>
              <Link to="/login">
                <Button fullWidth>Go to Login</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-primary-600" />
                </div>
                <h1 className="text-2xl font-display font-bold text-neutral-800">Reset Password</h1>
                <p className="text-neutral-500 text-sm mt-2">Enter your new password below.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.new_password?.message}
                  required
                  {...register('new_password')}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Repeat password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.confirm_password?.message}
                  required
                  {...register('confirm_password')}
                />
                <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
