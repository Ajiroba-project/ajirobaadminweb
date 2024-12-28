import { create } from 'zustand'
import Cookies from 'js-cookie'

// import { cookies } from 'next/headers'


// Retrieve user from cookie/local storage
const storedUser = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

// export const useAuthStore = create((set, get) => ({
//   isLoggedIn: !!Cookies.get('token'), // Check if token cookie exists on initialization
//   user: storedUser,
//   setLoggedIn: isLoggedIn => set({ isLoggedIn }),

//   user: null,
//   setUser: user => {
//     set({ user });
//     // Persist user in a cookie or local storage
//     Cookies.set('user', JSON.stringify(user), { sameSite: 'strict' });
//   },

//   setAuthCookie: (token, expirationDate, user) => {
//     Cookies.set('token', token, {
//       expires: expirationDate,
//       sameSite: 'strict' // Additional security measure
//     });
//     set({ isLoggedIn: true, user }); // Update isLoggedIn and user state
//     // Persist user in a cookie or local storage
//     Cookies.set('user', JSON.stringify(user), { sameSite: 'strict' });
//   },


//   clearAuthCookies: () => {
//     Cookies.remove('token');
//     Cookies.remove('user'); // Clear user cookie/local storage
//     set({ isLoggedIn: false, user: null }); // Update isLoggedIn and user state
//   }
// }))
// const cookieStore = cookies()
// const theme = cookieStore.get('theme')

export const useAuthStore = create((set) => ({
    isLoggedIn: !!Cookies.get('token'), // Check if token cookie exists on initialization
    user: JSON.parse(Cookies.get('user') || null),
    token: Cookies.get('token') || null,

    setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

    setUser: (user) => {
        Cookies.set('user', JSON.stringify(user), { sameSite: 'strict' });
        set({ user });
    },



    setAuthCookie: (token, user, expirationDate) => {

        // cookies().set('token_new', token)
        Cookies.set('token', token, {
            expires: expirationDate,
            sameSite: 'strict' // Additional security measure
        });


        Cookies.set('user', JSON.stringify(user), {
            expires: expirationDate,
            sameSite: 'strict' // Additional security measure
        });


        set({ isLoggedIn: true, user }); // Update isLoggedIn and user state
    },

    clearAuthCookies: () => {
        Cookies.remove('token');
        Cookies.remove('user');
        set({ isLoggedIn: false, user: null }); // Update isLoggedIn and user state
    }
}));




export const userNavStore = create(set => ({
    headerNav: '/',
    userNav: '',
    isNavbarOpen: false,
    sidebar: false,
    walletModal: false,
    // headerNav: 'Home',

    setUserNav: text => set({ userNav: text }),
    /*  setHeaderNav: text => set({ headerNav: text }), */
    setHeaderNav: text => set({ headerNav: text }),
    toggleNavbar: () => set(state => ({ isNavbarOpen: !state.isNavbarOpen })),
    toggleSidebar: () => set(state => ({ sidebar: !state.sidebar })),
    setWalletModal: () => set(state => ({ walletModal: !state.walletModal })),
    seHeaderNav: text => set({ headerNav: text })
}))



// export const profilePhoto = create(set => ({
//   profileurl: '',

//   setProfileurl: url => set({ profileurl: url }),

// }))

export const profilePhoto = create((set) => ({
    profileurl: '',
    setProfileurl: (url) => set({ profileurl: url }),
}));


export const userOTPStore = create(set => ({
    user_otp: '',
    /* set_user_Otp: text => set({ otp: text }) */
    set_user_Otp: (otp) => set({ user_otp: otp }),
}))


export const userProfile = create(set => ({

    activeMenu: 'my profile',
    profileUpload: '',
    profile: false,
    editProfile: false,
    editPassword: false,
    successModal: false,
    userDetails: {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        lga: '',
        residency: '',
        balance: '',
        profile_image_url: ''
    },
    setEditProfile: () => set(state => ({ editProfile: !state.editProfile })),
    setProfile: () => set(state => ({ profile: !state.profile })),
    setEditPassword: () => set(state => ({ editPassword: !state.editPassword })),
    setactiveMenu: text => set({ activeMenu: text }),
    setprofileUpload: text => set({ photo: text }),
    setUserDetails: text => set({ userDetails: text }),
    setSuccessModal: () => set(state => ({ successModal: !state.successModal }))
}))

export const DataPurchase = create(set => ({
    stepper: 0,
    dataDetails: {
        network: '',
        data: '',
        phone: '',
        amount: ''
    },

    setStepper: text => set({ stepper: text }),
    setDataDetails: text => set({ dataDetails: text })
}))

export const AirtimePurchase = create(set => ({
    AirtimeStepper: 0,
    AirtimeDetails: {
        network: '',
        phone: '',
        amount: ''
    },
    walletModal: false,

    setAirtimeStepper: text => set({ AirtimeStepper: text }),
    setAirtimeDetails: text => set({ AirtimeDetails: text })
}))

export const CablePurchase = create(set => ({
    CableStepper: 0,
    CableDetails: {
        name: 'Testing',
        network: '',
        smartcard: '',
        netpackage: '',
        amount: '--'
    },

    setCableStepper: text => set({ CableStepper: text }),
    setCableDetails: text => set({ CableDetails: text })
}))

export const ElectricityPurchase = create(set => ({
    ElectricityStepper: 0,
    ElectricityDetails: {
        disco: '',
        meter: '',
        phone: '',
        package: '',
        meter_no: '',
        amount: ''
    },
    walletModal: false,

    setElectricityStepper: text => set({ ElectricityStepper: text }),
    setElectricityDetails: text => set({ ElectricityDetails: text })
}))
