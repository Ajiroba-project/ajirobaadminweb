import Image from "next/image";
import Brand from "../asset/logo.svg";
import Link from "next/link"

type headerTitleProps = { 
    title:string,
    subtitle:string
}


export const Header = () => {
  return <div>header</div>;
};

export const RegistrationHeader = () => {
  return (
    <>
      <nav className="container p-12 lg:px-14 px-7 md:block   flex justify-center">
       <Link href="/">
        <Image src={Brand} alt="Ajiroba Logo" />
       </Link>
      </nav>
    </>
  );
};


export const HeaderTitle =({title, subtitle}:headerTitleProps )=>{
    return (
        <>
        <section className='flex justify-center items-center flex-col'>
            <h1 className='xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-bold leading-tight tracking-tight text-left'>{title}</h1>
            <p className=' mt-4 text-sm font-normal leading-6 text-center xl:w-1/3 w-auto  text-[#353131]' >{subtitle}</p>
        </section>
        </>
   
    )
}