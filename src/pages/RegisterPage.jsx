import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Home } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { selectIsAuthenticated } from '@/store/slices/authSlice.js';
import { setCredentials } from '@/store/slices/authSlice.js';
import { useRegisterMutation } from '@/api/apiSlice.js';
import { registerSchema } from '@/utils/validators.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [registerUser] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await registerUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirm: data.confirm_password,
      }).unwrap();

      dispatch(setCredentials({
        user: result.data.user,
        accessToken: result.data.access,
        refreshToken: result.data.refresh,
      }));

      toast.success(`Welcome to ArtisanHome, ${data.first_name}!`);
      navigate('/', { replace: true });
    } catch (err) {
      const errors = err?.data;
      if (errors?.email) toast.error(errors.email[0]);
      else if (errors?.detail) toast.error(errors.detail);
      else toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-warm-lg p-8"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-warm-gradient rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-neutral-800">
                Artisan<span className="text-primary-600">Home</span>
              </span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-neutral-800">Create your account</h1>
            <p className="text-neutral-500 text-sm mt-1">Join our community of home decor lovers</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.first_name?.message}
                required
                {...register('first_name')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.last_name?.message}
                required
                {...register('last_name')}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              autoComplete="email"
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              helperText="At least 8 characters with uppercase and number"
              required
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirm_password?.message}
              required
              {...register('confirm_password')}
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agree_terms"
                className="mt-0.5 rounded border-neutral-300 accent-primary-600"
                {...register('agree_terms')}
              />
              <label htmlFor="agree_terms" className="text-sm text-neutral-600 leading-snug">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agree_terms && (
              <p className="text-xs text-red-500">{errors.agree_terms.message}</p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;
