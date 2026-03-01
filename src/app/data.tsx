import user from "@/app/asset/user-icon.svg"
import category from "@/app/asset/category-icon.svg"
import product from "@/app/asset/product-icon.svg"
import transaction from "@/app/asset/transaction-icon.svg"
import upload from "@/app/asset/upload-icon.svg"
import ag from "@/app/asset/ag.svg"
import tmg from "@/app/asset/tmg.svg"
import tns from "@/app/asset/tns.svg"
import ps from "@/app/asset/ps.svg"
import bid from "@/app/asset/bid.svg"
import ticket from "@/app/asset/ticket.svg"
import user_img from "@/app/asset/user.png"
import analytics from "@/app/asset/analytics.svg"
import redemption from "@/app/asset/redemption.svg"
import reportsicon from "@/app/asset/reportsicon.svg"

export const SideNavMenu = [
    {
        name: "User Details",
        path: "/dashboard/userdetails",
        icon: user,
        url: 'userdetails'

    },

    {
        name: "Upload",
        path: "/dashboard/upload",
        icon: upload,
        url: 'upload'
    },
    {
        name: "Product",
        path: "/dashboard/product",
        icon: product,
        url: 'product'
    },
    {
        name: "Category",
        path: "/dashboard/category",
        icon: category,
        url: 'category'
    },

    {
        name: "Product Redemption",
        path: "/dashboard/redemption",
        icon: redemption,
        url: 'redemption'
    },
    {
        name: "Transaction",
        path: "/dashboard/transaction",
        icon: transaction,
        url: 'transaction'

    },
    {
        name: "Analytics",
        path: "#",
        icon: analytics,
        url: 'analytics'
    },
    {
        name: "Reports",
        path: "/dashboard/reports",
        icon: reportsicon,
        url: 'reports'
    },
]

export const HeaderNavMenu = [
    {
        name: "Community",
        path: "/community",

    }, {
        name: "Profile",
        path: "/userprofile",

    }
    
    // , 
    
    // {
    //     name: "Live Chat",
    //     path: "/livechat",

    // }

]

export const regularDetails = [
    {
        icon: tmg,
        name: "TOTAL REGISTERED USER",
        count: 0
    },
    {
        icon: tns,
        name: "TOTAL NUMBER OF SALES",
        count: 0
    },
    {
        icon: ag,
        name: "AMOUNT GENERATED",
        count: 0
    },
    {
        icon: ps,
        name: "PENDING SSALES",
        count: 0
    },
]

export const auctionDetails = [
    {
        icon: tmg,
        name: "TOTAL REGISTERED USER",
        count: 0
    },
    {
        icon: ticket,
        name: "TOTAL TICKET PURCHASED",
        count: 0
    },
    {
        icon: bid,
        name: "TOTAL BID MADE",
        count: 0
    },
    {
        icon: ag,
        name: "TOTAL AMOUNT GENERATED",
        count: 0
    },
]

export const users = [{
    first_name: "Tonia ",
    surname: "Joe",
    email: "tonia@gmail.com",
    phone: "123456",
    city: "ikeja",
    address: "1, adeniyi jones, ikeja lagos ",
    ticketPurchase: "5",
    totalAmount: "1000",
    photo: user_img
},
{
    first_name: "John ",
    surname: "Deo",
    email: "john@gmail.com",
    phone: "123456",
    city: "Alimosho",
    address: "Alimosho Lagos",
    ticketPurchase: "2",
    totalAmount: "3000",
    photo: user_img
},
]

export const categories = [
    "Accessories",
    'Computing',
    "Electronics",
    "FoodStuff",
    "Fashion",
    "Men's Fashion",
    'Mother and Child',
    "Phones",
    'Royalty',
    "Women's Fashion",
]


export const subcategories = [
    "Fruits",
    "Vegetable",
    "Tubers",
    "Legumes",
    "Diary",
    "Meat",
    "Cereal",
    "Snickers",
    "Clothing",
    "Underwear",
    "T-shirt",
    "Polo",
    "knicker",
    "Jewelry",
    "Belt",
    "Shoe",
    "Clothing",
    "Accessories",
    "Hand Bag",
    "Sleep Wear",
    "Matanity",
    "Dresses",
    "Traditional",
    "Men Sunglasses",
    "Men Watches",
    "Women Sunglasses",
    "Women Watches",
    "Television",
    "Smart Tv`s",
    "Sound Bars ",
    "Video ",
    "Projectors",
    "Digital Camera",
    "Camcoder",
    "Generators ",
    "Inverters ",
    "Smart Phones",
    "Basic Phones",
    "Refubished",
    "Ipad",
    "Andriod Tablets",
    "Educational Tablets",
    "Tablets Accessory",
    "Earphones",
    "Chargers",
    "Toys",
    "Bibs",
    "Diapers",
    "Bathing Tub",
    "Bathing Safety",
    "Towels",
    "Walkers",
    "Swings",
    "Jumpers",
    "Bead",
    "Walking Stick",
    "Staff",
    "Capes",
    "Crown",
    "Hair Pin",
    "Fan",
    "Anklet",
    "Bracelet",
];





export const ProductLists = [
    {
        name: "Apple",
        description: "Fresh apples",
        price: 100,
        discount: 3,
        category: "FoodStuff",
        subcategory: "Fruit",
        image: [{

        }],
        date: ""
    },
    {
        name: "Iphone",
        description: " Iphone 6 SmartPhone",
        price: 100,
        discount: 3,
        category: "SmartPhone",
        subcategory: "Phones",
        image: [{

        }],
        date: ""
    },


]




export const AuctionLists = [
    {
        name: "Apple",
        description: "Fresh apples",
        price: 100,
        discount: 3,
        category: "FoodStuff",
        subcategory: "Fruit",
        image: [{}],
        TNB: "100",
        NTS: "10000",
        ticket_amount: "4000 each",
        total_amount: "₦20000",
        duration: "3 hrs",
    },
    {
        name: "Iphone",
        description: " Iphone 6 SmartPhone",
        price: 100,
        discount: 3,
        category: "SmartPhone",
        subcategory: "Phones",
        image: [{}],
        TNB: "120",
        NTS: "500",
        ticket_amount: "200 each",
        total_amount: "₦10000",
        duration: "1 day",
    },
];