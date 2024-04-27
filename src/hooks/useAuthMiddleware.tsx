import { useEffect } from 'react';

const useAuthMiddleware = (isLoggedIn, router) => {
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
    } else {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  return;
};

export default useAuthMiddleware;
