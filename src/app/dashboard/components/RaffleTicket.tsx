import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import Brand from '../../asset/logo.svg';

// A more accurate SVG logo component

const AjirobaLogo = ({ className = "h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8", textClassName = "text-base sm:text-lg md:text-xl" }) => (
    <div className="flex items-center bg-white  py-1 px-2 md:px-3 rounded-md shadow-md">
        <Link href={'/'} className={``}   >
            <Image src={Brand} alt='brand-logo' />
        </Link>

    </div>
);




const TicketCard = ({
    // ticketPrice = "N 200",
    // purchaseDate = "May 23, 2025",
    // product = "T- Shirt",
    // raffleDate = "May 23, 2025",
    // raffleTime = "7:30 PM"
    ticketPrice,
    purchaseDate,
    product,
    raffleDate,
    raffleTime,
}: {
    ticketPrice: string | number | undefined | null;
    purchaseDate: string | number | undefined | null;
    product: string | number | undefined | null;
    raffleDate: string | number | undefined | null;
    raffleTime: string | number | undefined | null;
}) => {
    return (
        <div className="">
            {/* Ticket Price */}
            <div className="mb-3 md:mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs md:text-sm">Ticket Price:</span>
                    <div className="bg-white text-gray-800 px-2 py-1 rounded text-xs md:text-sm font-medium w-28 md:w-40 text-center">
                        {ticketPrice}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>

            {/* Purchase Date */}
            <div className="mb-3 md:mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs md:text-sm">Purchase Date:</span>
                    <div className="bg-white text-gray-800 px-2 md:px-4 py-1 rounded text-xs md:text-sm w-28 md:w-40 text-center">
                        {purchaseDate
                            ? (() => {
                                // Handles ISO 8601 format like "2025-05-12T09:29:03.800738+01:00"
                                const dateObj = new Date(purchaseDate as string);
                                if (isNaN(dateObj.getTime())) return purchaseDate;
                                const day = dateObj.getDate();
                                const month = dateObj.toLocaleString('en-US', { month: 'long' });
                                const year = dateObj.getFullYear();
                                return `${day} ${month}, ${year}`;
                            })()
                            : ''}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>

            {/* Product */}
            <div className="mb-3 md:mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs md:text-sm">Product:</span>
                    <div className="bg-white text-gray-800 px-2 md:px-4 py-1 rounded text-xs md:text-sm w-28 md:w-40 text-center">
                        {product}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>

            {/* Raffle Date */}
            <div className="mb-3 md:mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs md:text-sm">Raffle Date:</span>
                    <div className="bg-white text-gray-800 px-2 md:px-4 py-1 rounded text-xs md:text-sm w-28 md:w-40 text-center">
                        {raffleDate}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>

            {/* Raffle Time */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs md:text-sm">RaffleTime:</span>
                    <div className="bg-white text-gray-800 px-2 md:px-4 py-1 rounded text-xs md:text-sm w-28 md:w-40 text-center">
                        {raffleTime}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>
        </div>
    );
};




const TicketCardMobile = ({
    /*   ticketPrice = "N 200",
      purchaseDate = "May 23, 2025",
      product = "T- Shirt",
      raffleDate = "May 23, 2025",
      raffleTime = "7:30 PM" */
    ticketPrice,
    purchaseDate,
    product,
    raffleDate,
    raffleTime,
}: {
    ticketPrice: string | number | undefined | null;
    purchaseDate: string | number | undefined | null;
    product: string | number | undefined | null;
    raffleDate: string | number | undefined | null;
    raffleTime: string | number | undefined | null;
}) => {
    return (
        <div className="">
            {/* Ticket Price */}
            <div className="mb-3 md:mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-[10px] md:text-[10px]">Ticket Price:</span>
                    <div className="bg-white text-gray-800 px-2 py-1 rounded text-[10px] md:text-[10px] font-medium w-28 md:w-40 text-center">
                        {ticketPrice}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>

            {/* Purchase Date */}
            <div className="mb-3 md:mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-[10px] md:text-[10px]">Purchase Date:</span>
                    <div className="bg-white text-gray-800 px-2 md:px-4 py-1 rounded text-[10px] md:text-[10px] w-28 md:w-40 text-center">
                        {purchaseDate
                            ? (() => {
                                // Handles ISO 8601 format like "2025-05-12T09:29:03.800738+01:00"
                                const dateObj = new Date(purchaseDate as string);
                                if (isNaN(dateObj.getTime())) return purchaseDate;
                                const day = dateObj.getDate();
                                const month = dateObj.toLocaleString('en-US', { month: 'long' });
                                const year = dateObj.getFullYear();
                                return `${day} ${month}, ${year}`;
                            })()
                            : ''}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>

            {/* Product */}
            <div className="mb-3 md:mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-[10px] md:text-[10px]">Product:</span>
                    <div className="bg-white text-gray-800 px-2 md:px-4 py-1 rounded text-[10px] md:text-[10px] w-28 md:w-40 text-center">
                        {product}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>

            {/* Raffle Date */}
            <div className="mb-3 md:mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-[10px] md:text-[10px]">Raffle Date:</span>
                    <div className="bg-white text-gray-800 px-2 md:px-4 py-1 rounded text-[10px] md:text-[10px] w-28 md:w-40 text-center">
                        {raffleDate}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>

            {/* Raffle Time */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-[10px] md:text-[10px]">RaffleTime:</span>
                    <div className="bg-white text-gray-800 px-2 md:px-4 py-1 rounded text-[10px] md:text-[10px] w-28 md:w-40 text-center">
                        {raffleTime}
                    </div>
                </div>
                <div className="border-b-3 border-dashed border-white opacity-60"></div>
            </div>
        </div>
    );
};

// Main RaffleTicket Component - Overhauled for accuracy
export default function RaffleTicket({
    // ticket_number = '1414199',
    // ticket_price = 'N 200',
    // purchase_date = 'May 23, 2025',
    // product = 'T - Shirt',
    // raffle_date = 'May 23, 2025',
    // raffle_time = '7.30 PM',
    onClose,
    ticket_number,
    ticket_price,
    purchase_date,
    product,
    raffle_date,
    raffle_time,
}: {
    onClose?: () => void;
    ticket_number: string | number | undefined | null;
    ticket_price: string | number | undefined | null;
    purchase_date: string | number | undefined | null;
    product: string | number | undefined | null;
    raffle_date: string | number | undefined | null;
    raffle_time: string | number | undefined | null;
}) {


    return (
        <div className="toCenterOfPage font-['Inter',_sans-serif]">
            {/* Main Container */}
            <div className="w-full max-w-5xl rounded-2xl md:rounded-3xl shadow-2xl relative flex flex-col md:flex-row bg-gradient-to-r from-[#d33f00] to-[rgba(211,63,0,255)] overflow-hidden">
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white text-2xl z-20"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                )}
                {/* Background texture */}
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/clean-gray-paper.png)' }}></div>

                {/* Left Side (Main Ticket) */}
                <div className="w-full md:flex-[2] p-4 md:p-8 text-white relative flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between flex-wrap gap-2 items-start mb-3 md:mb-4">
                            <AjirobaLogo />
                            <div className="bg-white text-black text-xs md:text-sm font-semibold py-1 px-2 md:px-3 rounded-md shadow-md">
                                TICKET NO: <span className="font-bold">{ticket_number}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                            <div>
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-light">Raffle Draw</h2>
                                <div className="relative inline-block mt-1">
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white relative z-10 tracking-tighter">Ticket</h1>
                                    <div className="absolute left-[4rem] md:left-[6rem] right-[-0.5rem] bottom-[0.1rem] h-1.5 md:h-2 bg-black transform -skew-y-[8deg] z-0"></div>
                                </div>
                            </div>

                            <div className="bg-[#de4600] p-3 md:p-4 rounded-lg shadow-lg">
                                <TicketCard ticketPrice={ticket_price} purchaseDate={purchase_date} product={product} raffleDate={raffle_date} raffleTime={raffle_time} />
                            </div>
                        </div>
                    </div>

                    <p className="text-white text-xs md:text-sm items-center text-center italic mt-6 md:mt-8">
                        ...The more ticket you buy, the more your chances of winning
                    </p>
                </div>

                {/* Divider */}
                <div className="relative my-4 md:my-0 flex md:flex-col items-center justify-center px-4 md:px-0">
                    <div className="w-full h-px md:h-full md:w-px bg-[repeating-linear-gradient(to_bottom,white,white_4px,transparent_4px,transparent_8px)]"></div>
                    <div className="absolute bg-gradient-to-r from-[#F26522] to-[#F7941D] p-1 rounded-full transform rotate-90 md:rotate-0">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                </div>

                {/* Right Side (Stub) */}
                <div className="w-full md:flex-[1] p-4 md:p-6 text-white relative flex flex-col justify-between items-center">
                    <div>
                        <div className="flex justify-between sm:flex-nowrap flex-wrap w-full items-start mb-6 md:mb-8 gap-8">
                            <AjirobaLogo className="h-4 w-4 md:h-5 md:w-5" textClassName="text-sm md:text-base" />
                            <div className="bg-white text-black text-xs font-semibold py-1 px-2 rounded-md shadow-md whitespace-nowrap">
                                TICKET NO: {ticket_number}
                            </div>
                        </div>

                        <div className=" w-full mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-light">Raffle Draw</h2>
                            <div className="relative inline-block mt-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-white relative z-10 tracking-tighter">Ticket</h1>
                                <div className="absolute left-[2rem] right-[-1rem] bottom-[0.1rem] h-1 md:h-1.5 bg-black transform -skew-y-[8deg] z-0"></div>
                            </div>
                        </div>

                        {/*   <div className="bg-[#de4600] p-2 md:p-3 rounded-lg shadow-lg w-full text-xs">
                            {ticketDetails.map(item => <TicketRow key={item.label} {...item} />)}
                        </div> */}

                        <div className="bg-[#de4600] p-3 md:p-3 rounded-lg shadow-lg w-full">
                            <TicketCardMobile ticketPrice={ticket_price} purchaseDate={purchase_date} product={product} raffleDate={raffle_date} raffleTime={raffle_time} />
                        </div>
                    </div>

                    <p className="text-white text-xs italic mt-4 md:mt-6 text-center">
                        ...The more ticket you buy, the more your chances of winning
                    </p>
                </div>

                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-white opacity-20"></div>
            </div>
        </div>
    );
}
