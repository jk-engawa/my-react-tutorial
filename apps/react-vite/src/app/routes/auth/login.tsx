import { useNavigate, useSearchParams } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { paths } from '@/config/paths';
import { LoginForm } from '@/features/auth/components/login-form';
import { logIn } from '@/lib/oauth2';

function LoginRoute () {
  logIn();

  return null;
};

export default LoginRoute;
