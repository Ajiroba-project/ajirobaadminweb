'use client'
import { formatCurrency } from '@/utils/formatCurrency'
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
                    src={`https://staging.ajiroba.ng/v1${cardInfo.profile_image}`}
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
                <p><strong>Amount:</strong> {formatCurrency(cardInfo.amount)}</p>
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
