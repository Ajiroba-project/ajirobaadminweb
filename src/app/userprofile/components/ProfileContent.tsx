import React, { useEffect } from 'react'
import { userProfile } from '@/store/store'
// import { ProfileDetails } from './ProfileDetails'
// import { AuctionDetails } from './AuctionDetails'
// import { OrderDetails } from './OrderDetails'
// import { WalletDetails } from './WalletDetails'
// import MainLayout from './CommunityDetails'
import { useSearchParams } from 'next/navigation'
import { ProfileDetails } from './ProfileDetails';

// import { useAuthStore } from '@/store/store'
// import { useAuthStore } from '@/store/store'
// import { useAuthStore } from '@/store/store'

export const ProfileContent = () => {
  // const activeMenu = userProfile(state => state.activeMenu)
  // const menu = ['my profile', 'auction win', 'my order', 'wallet', 'community']

  const {
    activeMenu,
    setactiveMenu,

  } = userProfile((state) => ({
    activeMenu: state.activeMenu,
    setactiveMenu: state.setactiveMenu,

  }));

    const searchParams = useSearchParams()

  const query = searchParams.get('q')




  return (
    <section className='' >

  <ProfileDetails />

    
    </section>
  )
}