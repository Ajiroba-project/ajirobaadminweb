
import { useEffect } from 'react';
import { useAuthStore } from '@/store/store';


const useAuthMiddleware = (router:any) => {
    // const  isLoggedIn  = useAuthStore(state => state.isLoggedIn);

      const { isLoggedIn, user } = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
    user: state.user
  }));

 /*  useEffect(() => {

    if (!isLoggedIn) {
      // If the token cookie is not present, redirect to the sign-in page

      router.push('/signin');
    } else {
      // If the token cookie is present, redirect to the dashboard
      router.push('/dashboard');

    }
  }, [isLoggedIn, router]);

  return; */


    useEffect(() => {
    if (typeof isLoggedIn === 'undefined' || typeof user === 'undefined') {
      return;
    }

    if (!isLoggedIn || !user) {
      router.push('/signin');
    }


  }, [isLoggedIn, user, router]);

    return null;
};

export default useAuthMiddleware;







// const useAuthOrders = (router: any, orderId?: string) => {
//   const { isLoggedIn, user } = useAuthStore(state => ({
//     isLoggedIn: state.isLoggedIn,
//     user: state.user
//   }));

//   useEffect(() => {
//     if (typeof isLoggedIn === 'undefined' || typeof user === 'undefined') {
//       return;
//     }

//     if (!isLoggedIn || !user) {
//       router.push('/signin');
//     }


//   }, [isLoggedIn, user, orderId, router]);

//   return null;
// };

// export { useAuthOrders };


