import React from 'react';

interface AuthHeroProps {
    title: string;
    menu?: string;
}

function AuthHero({ title, menu }: AuthHeroProps) {
    return (
        <section className='flex justify-center items-center flex-col' >
            <h1 className='xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-Poppins text-[#111111] leading-tight tracking-tight text-left '  >{title}</h1>
            <p className=' mt-4 text-sm font-normal leading-6 text-center xl:w-1/3 w-auto  text-[#353131]' >{menu}</p>
        </section>
    );
}

export default AuthHero;



export const HeroSubText = ({ title, menu }: AuthHeroProps)=>{
 return (
       /*  <section className='flex justify-center items-center flex-col' >
            <h1 className='xl:text-2xl 2xl:text-2xl md:text-2xl text-[36px] font-semibold font-Poppins text-[#111111] leading-tight tracking-tight text-left '  >{title}</h1>
            <p className=' text-[12px] font-normal leading-6 text-center  w-auto  text-[#353131]' >{menu}</p>
        </section> */
        <section className="flex justify-center items-center flex-col">
  <h1 className="text-[24px] md:text-[32px] lg:text-[36px] xl:text-2xl 2xl:text-2xl font-semibold font-Poppins text-[#111111] leading-tight tracking-tight text-center">
    {title}
  </h1>
  <p className="text-[12px] md:text-[14px] lg:text-[10px] font-normal leading-6 text-center text-[#353131]">
    {menu}
  </p>
</section>

    );
}
