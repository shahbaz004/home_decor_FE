import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice.js';
import { useGoogleLoginMutation } from '@/api/apiSlice.js';
import { PageSpinner } from '@/components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [googleLogin] = useGoogleLoginMutation();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      toast.error('Google authentication failed');
      navigate('/login');
      return;
    }

    googleLogin({ code })
      .unwrap()
      .then((result) => {
        dispatch(setCredentials({
          user: result.user,
          accessToken: result.access,
          refreshToken: result.refresh,
        }));
        toast.success(`Welcome, ${result.user?.first_name || 'there'}!`);
        navigate('/', { replace: true });
      })
      .catch(() => {
        toast.error('Google authentication failed. Please try again.');
        navigate('/login');
      });
  }, []);

  return <PageSpinner />;
}

export default GoogleCallbackPage;
