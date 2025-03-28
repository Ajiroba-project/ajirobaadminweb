// 'use client'
// import { Poppins } from 'next/font/google'
// import Image from 'next/image'
// import { FaStar } from 'react-icons/fa'
// import Link from 'next/link'
// import { useState } from 'react'
// import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
// import { useRouter } from 'next/navigation'

// const poppins = Poppins({ subsets: ['latin'], weight: ['400', '900'] })


// interface Product {
//     id: string;
//     name: string;
//     ticket_price: number;
//     images: { image: string }[];
//     product_reviews: {
//         average_ratings: number;
//         total_reviews: number;
//     };
//     weight?: string;
// }

// interface ProductsCardProps {
//     cardInfo: Product[];
// }





// export const ProductsbillCard = ({ cardInfo }: ProductsCardProps) => {

//     console.log(cardInfo, 'cardInfo')


//     const star = [1, 2, 3, 4, 5]

//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 12; // adjust this value to change the number of items per page
//     const totalPages = cardInfo &&  Math.ceil(cardInfo?.length / itemsPerPage);

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const paginatedCardInfo = cardInfo?.slice(startIndex, endIndex);

//     const router = useRouter()




//     return (
//         <>


//             <div
//                 className={`${poppins.className} my-8 grid grid-cols-1 gap-8  md:grid-cols-2 lg:grid-cols-4 mb-8 mt-4   `}
//             >



//                 {paginatedCardInfo?.map((value, index) => (
//                     <div onClick={() => router.push(`/categories/productdetails/${value.id}`)} className=' border border-white shadow-sm ' key={index}>
//                       {/*   {console.log(value, 'value')} */}
//                         <div className='py-2 bg-[#F6F6F6]'>
//                             <div className='flex items-center justify-center'>
//                                 <Image
//                                     src={`https://ajiroba.onrender.com${value?.images[0]?.image}`}
//                                     alt="product"
//                                     className=""
//                                     width={120}
//                                     height={300}
//                                     objectFit="cover"
//                                 />
//                             </div>
//                         </div>
//                         {/* <hr /> */}
//                         <div className=' '>
//                             <div className='flex flex-col gap-2 px-2'>
//                                 <div className='flex  w-full items-center justify-between gap-3 capitalize'>
//                                     <div className=' text-sm font-semibold'>
//                                         <p className=' font-Poppins text-[13px] font-bold'>{value.name}</p>
//                                     </div>

//                                      <div className='justify-start'>
//                                         {/* <p className="text-sm" >Ticket Price:</p> */}
//                                         <p  className=' font-Poppins text-[13px] font-semibold flex justify-end text-[#F25E26] '>
//                                             ₦&nbsp;{value.ticket_price}
//                                             <span className='font-semibold '></span>
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className='flex justify-between'>

//                                     <p className='flex justify-end text-left'>
//                                        {/*  {Array.from({ length: value?.product_reviews?.average_ratings }, (_, index) => (
//                                             <span key={index}>
//                                                 <FaStar className="text-[#F25E26]" />
//                                             </span>
//                                         ))} */}
//                                         2pcs
//                                     </p>


//                                       <div className='justify-start'>
//                                        {/*  <p className='w-max text-[10px] font-normal font-Poppins  text-[#242423]'>
//                                            ({value?.product_reviews?.total_reviews})
//                                             <span className='font-semibold '></span>
//                                         </p> */}
//                                     </div>
//                                 </div>
//                                 <p className='text-[13px] font-Poppins  text-[#2A2A2A] '>
//                                  {/*   w - {value?.weight || 'NA'} */}
//                                  Ergonomics Wired Mouse
//                                 </p>
//                             </div>
//                         </div>

//                     </div>

//                 ))}



//             </div>

//           {/*   <div className='flex justify-center items-center mb-20 ' >


//             </div> */}



//         </>
//     )
// }




'use client'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '900'] })

interface BillDetails {
    id: string;
    name: string;
    profile_image: string;
    biller: string;
    amount: number;
    email: string;
    address: string;
    phone: string;
    date_created: string;
}

interface BillCardProps {
    cardInfo: BillDetails; // Now it's a single object, not an array
}

export const ProductsbillCard = ({ cardInfo }: BillCardProps) => {
    const router = useRouter();

    return (
        <div className={`${poppins.className} my-8  border border-white shadow-sm p-6 rounded-lg`}>
            <div className="flex items-center gap-4">
              {/*   <Image
                    src={`https://ajiroba.onrender.com${cardInfo.profile_image}`}
                    alt={cardInfo.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                />
                <div>
                    <h2 className="text-lg font-bold">{cardInfo.name}</h2>
                    <p className="text-sm text-gray-500">{cardInfo.email}</p>
                </div> */}
            </div>

            <div className="mt-4">
                <p><strong>Biller:</strong> {cardInfo.biller}</p>
                <p><strong>Amount:</strong> ₦{cardInfo.amount.toFixed(2)}</p>
                <p><strong>Phone:</strong> {cardInfo.phone}</p>
                <p><strong>Address:</strong> {cardInfo.address}</p>
                <p className="text-sm text-gray-500"><strong>Date:</strong> {new Date(cardInfo.date_created).toLocaleString()}</p>
            </div>

          {/*   <button
                onClick={() => router.push(`/bills/${cardInfo.id}`)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
                View Details
            </button> */}
        </div>
    );
}
