"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import bgImg from "@/app/asset/analytics.svg"; // Use a local asset as a background image
import { ProfileHeader } from "@/app/components/Header";
import rice from '@/app/asset/image/rice3.jpeg'

export default function ProductDetailsAuctionPage() {
    // Mock data (replace with real data fetching logic)
    const params = useParams();

    const router = useRouter();

    const id = params?.id;
    const product = {
        category: "Fashion",
        subCategory: "Men's Fashion",
        productName: "T-shirt",
        weight: "5kg",
        uploadedBy: "Idowu Shayo",
        dateOfRaffle: "15-March-2024",
        time: "12:00PM",
        duration: "3 Hours",
        totalBidders: 120,
        productId: "2367835",
        ticketsSold: 500,
        ticketAmount: "₦200",
        totalAmount: "₦100,000",
        revenue: "₦400,000",
        rda: "₦260,000",
        eca: "₦140,000",
        winners: 3,
        summary: {
            name: "Mama Gold Rice",
            price: "₦200",
            ticketPrice: "Ticket Price",
            quantity: 2,
            weight: "50kg",
            delivery: "Nov. 12 - Nov. 22",
            images: [
                "/asset/image/rice_sample.jpg",
                "/asset/image/rice1.jpeg"
            ],
            description: `Mama Gold Rice: Premium quality, long-grain rice known for its delicious taste and distinctive aroma. Aged to perfection, it guarantees a fluffy and non-sticky final result. Trusted for superior quality, perfect for both traditional and modern dishes. Elevate your dining experience with Mama Gold Rice.\n\n- 100% safe and trusted\n- Product of Nigeria\n- Origin: Hinotory FootHills\n- A known hit for its slender grains and distinct aroma, our Basmati rice is perfect for biryanis and pilafs.\n- Aged for perfection, for an enhanced flavor and fluffiness.\n- plain and clean with no dirt\n\nNote that we show the EU sizes for Stanley/Stella products. The sizes Elevate your culinary experience with our exquisite range of premium rice varieties, sourced from the finest fields around the world. We understand the importance of quality ingredients in creating memorable meals. Our curated collection of rice is sure to meet the expectations of discerning chefs and home cooks alike.`
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 w-full flex flex-col items-center font-poppins"  >
            <div className="w-full bg-gray-100" style={{ width: '100', maxWidth: '80%' }}>
                <div className="flex flex-col" >
                    <ProfileHeader />
                    <div className="flex items-center justify-between w-full">
                        <p
                            className="text-[#F25E26] underline cursor-pointer mt-2 mb-0  p-4 lg:px-14 px-7 "
                            onClick={() => router.back()}
                        >
                            Back
                        </p>
                        <h1 className="text-lg md:text-xl lg:text-2xl py-2 mb-6 font-semibold text-center flex-1">Products Details</h1>
                        <span className="w-24" /> {/* Spacer for symmetry */}
                    </div>
                </div>
            </div>

            {/* Product Summary Card */}
            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div
                    className="relative rounded-tl-xl rounded-tr-xl overflow-hidden shadow-lg"
                    style={{ width: '100%', maxWidth: '100%', marginLeft: 0, marginRight: 0 }}
                >
                    {/* Background image */}
                    <Image
                        src={require('@/app/asset/image/auctionproductdetailsbanner.jpg')}
                        alt="Product Summary Background"
                        fill
                        style={{ objectFit: 'cover', zIndex: 1 }}
                        className="absolute inset-0"
                        priority
                    />
                    {/* Overlay for darkening background */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
                    {/* Card Content */}
                    <div className="relative z-20 p-4 md:p-8 flex flex-col">
                        <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">Product Summary</h2>
                        <div className="bg-[#FFF3EE] rounded-xl flex flex-col md:flex-row justify-between items-stretch p-4 md:p-8 gap-6 flex-wrap">
                            {/* Left Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Category:</span>
                                    <span className="font-semibold text-[#222]">{product.category}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Sub category:</span>
                                    <span className="font-semibold text-[#222]">{product.subCategory}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Product Name:</span>
                                    <span className="font-semibold text-[#222]">{product.productName}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Weight:</span>
                                    <span className="font-semibold text-[#222]">{product.weight}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Uploaded By:</span>
                                    <span className="font-semibold text-[#222]">{product.uploadedBy}</span>
                                </div>
                            </div>
                            {/* Middle Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Date of Raffle:</span>
                                    <span className="font-semibold text-[#222]">{product.dateOfRaffle}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Time:</span>
                                    <span className="font-semibold text-[#222]">{product.time}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Duration:</span>
                                    <span className="font-semibold text-[#222]">{product.duration}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total no of bidders:</span>
                                    <span className="font-semibold text-[#222]">{product.totalBidders}</span>
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
                                <div className="flex items-center gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Product ID:</span>
                                    <span className="font-semibold text-[#222]">{product.productId}</span>
                                    <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block" />
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">No of tickets sold:</span>
                                    <span className="font-semibold text-[#F25E26]">{product.ticketsSold}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Ticket amount:</span>
                                    <span className="font-semibold text-[#222]">{product.ticketAmount}</span>
                                </div>
                                <div className="flex gap-2 text-base md:text-lg flex-wrap">
                                    <span className="text-[#7B7B7B] font-medium">Total amount:</span>
                                    <span className="font-semibold text-[#F25E26]">{product.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auction Summary */}
            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div className="w-full">
                    <h2 className="text-xl font-semibold mb-6 ml-2">Auction Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Revenue */}
                        <div className="flex border rounded-lg overflow-hidden bg-white">
                            <div className="bg-[#E5E5E5] flex items-center px-6 py-6 w-1/2 min-w-[120px] text-[#222] font-medium text-base md:text-lg">Revenue</div>
                            <div className="flex-1 flex items-center px-6 py-6 text-[#F25E26] font-semibold text-lg md:text-xl">{product.revenue}</div>
                        </div>
                        {/* RDA */}
                        <div className="flex border rounded-lg overflow-hidden bg-white">
                            <div className="bg-[#E5E5E5] flex items-center px-6 py-6 w-1/2 min-w-[120px] text-[#222] font-medium text-base md:text-lg">RDA</div>
                            <div className="flex-1 flex items-center px-6 py-6 text-[#F25E26] font-semibold text-lg md:text-xl">{product.rda}</div>
                        </div>
                        {/* ECA */}
                        <div className="flex border rounded-lg overflow-hidden bg-white">
                            <div className="bg-[#E5E5E5] flex items-center px-6 py-6 w-1/2 min-w-[120px] text-[#222] font-medium text-base md:text-lg">ECA</div>
                            <div className="flex-1 flex items-center px-6 py-6 text-[#F25E26] font-semibold text-lg md:text-xl">{product.eca}</div>
                        </div>
                        {/* No of Winners */}
                        <div className="flex border rounded-lg overflow-hidden bg-white">
                            <div className="bg-[#E5E5E5] flex items-center px-6 py-6 w-1/2 min-w-[120px] text-[#222] font-medium text-base md:text-lg">No of Winners</div>
                            <div className="flex-1 flex items-center px-6 py-6 text-[#F25E26] font-semibold text-lg md:text-xl">{product.winners}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Summary Section */}
            <div className="w-full flex justify-center items-center mt-8 px-2" style={{ width: '100', maxWidth: '75%' }}>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Product Info Card */}
                    <div className="border rounded-xl p-8 bg-white flex flex-col justify-between h-full">
                        <h3 className="text-2xl font-semibold mb-2">{product.summary.name}</h3>
                        <div className="text-3xl font-bold text-[#222] mb-1">₦ 200</div>
                        <div className="text-[#7B7B7B] text-lg mb-4">Ticket Price</div>
                        <hr className="my-4" />
                        <div className="mb-2 text-base text-[#7B7B7B]">Quantity Available: <span className="text-[#222] font-semibold">{product.summary.quantity}</span></div>
                        <div className="mb-2 text-base text-[#7B7B7B]">Weight: <span className="text-[#222] font-semibold">{product.summary.weight}</span></div>
                        <hr className="my-4" />
                        <div className="text-base text-[#7B7B7B] mb-1">Delivery Estimation</div>
                        <div className="text-lg font-bold text-[#222]">{product.summary.delivery}</div>
                    </div>
                    {/* Right: Product Images */}
                    <div className="bg-black rounded-xl flex flex-col  justify-center min-h-[350px] py-8">


                        <div className="flex flex-wrap sm:flex-nowrap ">
                            <div className="relative mt-6 ">

                                <Image
                                    src={rice}
                                    alt={`Product Image`}
                                    width={220}
                                    height={220}
                                    className="object-contain rounded"
                                />
                            </div>
                            <div className="relative opacity-35 sm:ml-4 mt-4 sm:mt-0">
                                <Image
                                    src={rice}
                                    alt={`Product Image`}
                                    width={220}
                                    height={220}
                                    className="object-contain rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}

            <div style={{ width: '100', maxWidth: '75%' }} className="py-12">
                <div className=" ">
                    <h1 className="text-[#363636] font-Poppins font-normal leading-[29px]">
                        {product.summary.description}
                    </h1>
                </div>
            </div>

        </div>
    );
}