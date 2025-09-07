'use client'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/utils/formatCurrency'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '900'] })


interface Product {
    description: any
    id: string;
    name: string;
    ticket_price: number;
    images: { image: string }[];
    product_reviews: {
        average_ratings: number;
        total_reviews: number;
    };
    weight?: string;
}

interface ProductsCardProps {
    cardInfo: Product[];
}





export const AuctionsCard = ({ cardInfo }: ProductsCardProps) => {


    const star = [1, 2, 3, 4, 5]

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // adjust this value to change the number of items per page
    const totalPages = cardInfo && Math.ceil(cardInfo?.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCardInfo = cardInfo?.slice(startIndex, endIndex);

    const router = useRouter()



    return (
        <>


            <div
                className={`${poppins.className} my-8 grid grid-cols-1 gap-8  md:grid-cols-2 lg:grid-cols-4 mb-8 mt-4   `}
            >



                {paginatedCardInfo?.map((value, index) => (
                    <div onClick={() => router.push(`/categories/productdetails/${value.id}`)} className=' border border-white shadow-sm ' key={index}>
                        {/*   {console.log(value, 'value')} */}
                        <div className='py-2 bg-[#F6F6F6]'>
                            <div className='flex items-center justify-center'>
                                <Image
                                    src={`https://staging.ajiroba.ng${value?.images[0]?.image}`}
                                    alt="product"
                                    className=""
                                    width={120}
                                    height={300}
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                        {/* <hr /> */}
                        <div className=' '>
                            <div className='flex flex-col gap-2 px-2'>
                                <div className='flex  w-full items-center justify-between gap-3 capitalize'>
                                    <div className=' text-sm font-semibold'>
                                        <p className=' font-Poppins text-[13px] font-bold'>{value.name}</p>
                                    </div>

                                    <div className='justify-start'>
                                        <p className="text-sm" >Ticket Price:</p>
                                        <p className=' font-Poppins text-[13px] font-semibold flex justify-end text-[#F25E26] '>
                                            {formatCurrency(value.ticket_price)}
                                            <span className='font-semibold '></span>
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-between'>

                                    <p className='flex justify-end text-left'>
                                        {/*  {Array.from({ length: value?.product_reviews?.average_ratings }, (_, index) => (
                                            <span key={index}>
                                                <FaStar className="text-[#F25E26]" />
                                            </span>
                                        ))} */}
                                        {/*   2pcs */}
                                    </p>


                                    <div className='justify-start'>
                                        {/*  <p className='w-max text-[10px] font-normal font-Poppins  text-[#242423]'>
                                           ({value?.product_reviews?.total_reviews})
                                            <span className='font-semibold '></span>
                                        </p> */}
                                    </div>
                                </div>
                                <p className='text-[13px] font-Poppins  text-[#2A2A2A] '>
                                    {/*   w - {value?.weight || 'NA'} */}
                                    {value.description}
                                </p>
                            </div>
                        </div>

                    </div>

                ))}



            </div>

            {/*   <div className='flex justify-center items-center mb-20 ' >


            </div> */}



        </>
    )
}

