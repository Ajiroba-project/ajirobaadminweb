
import { useEffect } from 'react';
import { useAuthStore } from '@/store/nav-store';

const useAuthMiddleware = (router) => {
    const  isLoggedIn  = useAuthStore(state => state.isLoggedIn);

  useEffect(() => {
  
    if (!isLoggedIn) {
      // If the token cookie is not present, redirect to the sign-in page
      
      router.push('/signin');
    } else {
      // If the token cookie is present, redirect to the dashboard
      router.push('/dashboard');
      
    }
  }, [router]);

  return;
};

export default useAuthMiddleware;