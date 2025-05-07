import { useNavigate, useSearchParams } from 'react-router';
import { Navigate } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { paths } from '@/config/paths';
import { LoginForm } from '@/features/auth/components/login-form';
import { getToken, logIn } from '@/lib/oauth2';

function CallbackRoute () {

  const token = getToken();

  if (token) return (
    <Navigate to={paths.app.root.getHref()} />
  );
};

export default CallbackRoute;
