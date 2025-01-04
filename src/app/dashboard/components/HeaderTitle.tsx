'use client'
import {useStore} from '@/store/nav-store';

export const HeaderTitle =()=>{
    const headingText = useStore(state => state.headingText);
    return (
        <>
       {/*  <section className='flex justify-center items-center text-center flex-col bg-[#F6F6F6] p-6 w-full fixed z-10  py-12'>
            <h1 className='xl:text-2xl 2xl:text-2xl md:text-2xl text-base  leading-tight tracking-tight font-Poppins '>{headingText}</h1>
        </section> */}

         <section className=' w-full flex justify-center items-center text-center bg-[#F6F6F6] p-6  fixed z-10  py-12'>
            <h1 className=' text-base font-Poppins '>{headingText}</h1>
        </section>
        </>

    )
}