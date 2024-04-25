'use client'
import {useStore} from '@/store/nav-store';

export const HeaderTitle =()=>{
    const headingText = useStore(state => state.headingText);
    return (
        <>
        <section className='flex justify-center items-center flex-col bg-[#F6F6F6] p-6 w-full '>
            <h1 className='xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-bold leading-tight tracking-tight text-left'>{headingText}</h1>
        </section>
        </>
   
    )
}