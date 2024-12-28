import product1 from '@/app/asset/image/product1.png'
import product2 from '@/app/asset/image/product2.png'
import product3 from '@/app/asset/image/product3.png'
import product4 from '@/app/asset/image/product4.png'
import product5 from '@/app/asset/image/product5.png'
import product6 from '@/app/asset/image/product6.png'
import product7 from '@/app/asset/image/product7.png'
import product8 from '@/app/asset/image/product8.png'
import fashionBeauty from '@/app/asset/image/fashionBeauty.png'
import fashion from '@/app/asset/image/fashion.png'
import computing from '@/app/asset/image/computing.png'
import phones from '@/app/asset/image/phones.png'
import mother from '@/app/asset/image/mother.png'
import royalty from '@/app/asset/image/royalty.png'
import phone from '@/app/asset/image/phone.png'
import fashions from '@/app/asset/image/fashions.png'
import foodstuff from '@/app/asset/image/foodstuff.png'
import mc from '@/app/asset/image/m&c.png'
import Social from '@/app/asset/socials/Social.svg'
import Social1 from '@/app/asset/socials/Social-1.svg'
import Social2 from '@/app/asset/socials/Social-2.svg'
import Social3 from '@/app/asset/socials/Social-3.svg'
import Social4 from '@/app/asset/socials/Social-4.svg'
import catPhone from '@/app/asset/image/phones.svg'
import catwc from '@/app/asset/image/wc.svg'
import catgroup from '@/app/asset/image/Group.svg'
import catfash from '@/app/asset/image/fash.svg'
import raf from '@/app/asset/image/raf.png'
import { IoLocationOutline } from 'react-icons/io5'
import { FiPhoneCall } from 'react-icons/fi'
import { LuMail } from 'react-icons/lu'

export const headerMenu = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Auction Deals',
    path: 'auction'
  },

  {
    name: 'Categories',
    path: 'categories'
  },
  {
    name: 'Recharge',
    path: 'recharge'
  },
  {
    name: 'Account',
    path: '/account',
    submenu: [
      { name: 'Sign Up', path: '/signup' },
      { name: 'Sign In', path: '/signin' },
      { name: 'Sign Out', path: '#' },
      { name: 'Profile', path: '/profile' },
      { name: 'Wallet', path: '/profile' },
      { name: 'Referral Code', path: '/profile' },
      { name: 'Community', path: '/profile' }
    ]
  },
  {
    name: 'Help',
    path: '/help',
    submenu: [
      { name: 'FAQ', path: '/faq' },
      { name: 'About Us', path: '/aboutUs' },
      { name: 'Contact Us', path: '/contactUs' },
      { name: 'Live Chat', path: '/livechat' },
      { name: 'Privacy Policy', path: '/privacy-policy' }
    ]
  }
]







export const categories = [
  {
    name: 'Foodstuff',
    path: 'categories/FoodStuff',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed dosed do ',
    image: product2,
    image2: foodstuff,
    svg: catgroup,

    categories: [
      {
        name: 'Fruits',
        path: 'category/Fruits',
        price: ''
      },
      {
        name: 'Vegetable',
        path: 'category/vegetable'
      },
      {
        name: 'Tubers',
        path: 'category/tubers'
      },
      {
        name: 'Cereal',
        path: '/'
      },
      {
        name: 'Legumes',
        path: '/'
      },
      {
        name: 'Diary',
        path: '/'
      },
      {
        name: 'Meat',
        path: '/'
      }
    ]
  },
  {
    name: 'Fashion and Beauty',
    path: 'categories/fashion and Beauty',
    image: fashionBeauty,
    image2: fashions,
    svg: catfash,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed dosed do ',
    categories: [
      {
        name: `Men's Fashion`,
        subcategory: [
          { name: 'Snickers', path: '' },
          { name: 'Clothing', path: '' },
          { name: 'Underwear', path: '' },
          { name: 'T-shirt', path: '' },
          { name: 'Polo', path: '' },
          { name: 'knicker', path: '' },
          { name: 'Jewelry', path: '' },
          { name: 'Belt', path: '' }
        ]
      },
      {
        name: `Women's Fashion`,
        subcategory: [
          { name: 'Shoe', path: '' },
          { name: 'Clothing', path: '' },
          { name: 'Accessories', path: '' },
          { name: 'Hand Bag', path: '' },
          { name: 'Sleep Wear', path: '' },
          { name: 'Matanity', path: '' },
          { name: 'Dresses', path: '' },
          { name: 'Traditional', path: '' }
        ]
      },
      {
        name: `Accessories`,
        subcategory: [
          { name: 'Men Sunglasses', path: '' },
          { name: 'Men Watches', path: '' },
          { name: 'Women Sunglasses', path: '' },
          { name: 'Women Watches', path: '' }
        ]
      }
    ]
  },
  {
    name: 'fashion',
    path: 'categories/fashion',
    image: fashion,
    image2: fashions,
    svg: catfash,
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi '
  },
  {
    name: 'Electronics',
    path: 'categories/Electronics',
    image: product4,
    image2: phone,
    svg: catPhone,

    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ',
    categories: [
      {
        name: 'Television',
        path: '/'
      },
      {
        name: 'Smart Tv`s',
        path: '/'
      },
      {
        name: 'Sound Bars ',
        path: '/'
      },
      {
        name: 'Video ',
        path: '/'
      },
      {
        name: 'Projectors',
        path: '/'
      },
      {
        name: 'Digital Camera',
        path: '/'
      },
      {
        name: 'Camcoder',
        path: '/'
      },
      {
        name: 'Generators ',
        path: '/'
      },
      {
        name: 'Inverters ',
        path: '/'
      }
    ]
  },
  {
    name: 'Phones',
    path: 'categories/Phones',
    image: phones,
    image2: phone,
    svg: catPhone,
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi',
    categories: [
      {
        name: 'Smart Phones',
        path: '/'
      },
      {
        name: 'Basic Phones',
        path: '/'
      },
      {
        name: 'Refubished',
        path: '/'
      },
      {
        name: 'Ipad',
        path: '/'
      },
      {
        name: 'Andriod Tablets',
        path: '/'
      },
      {
        name: 'Educational Tablets',
        path: '/'
      },
      {
        name: 'Tablets Accessory',
        path: '/'
      },
      {
        name: 'Earphones',
        path: '/'
      },
      {
        name: 'Chargers',
        path: '/'
      }
    ]
  },
  {
    name: 'Computing',
    path: 'categories/Computing',
    image: computing,
    image2: phone,
    svg: catPhone,
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ',

    categories: [
      {
        name: 'Desktop',
        path: '/'
      },
      {
        name: 'Laptop',
        path: '/'
      },
      {
        name: 'USB',
        path: '/'
      },
      {
        name: 'Hard Drives',
        path: '/'
      },
      {
        name: 'Printers',
        path: '/'
      },
      {
        name: 'Mouse',
        path: '/'
      },
      {
        name: 'Batteries',
        path: '/'
      },
      {
        name: 'Scanner',
        path: '/'
      },
      {
        name: 'Chargers',
        path: '/'
      }
    ]
  },
  {
    name: 'Mother and Child',
    path: 'categories/Mother and Child',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ',
    image: mother,
    image2: mc,
    svg: catwc,
    categories: [
      {
        name: 'Toys',
        path: '/'
      },
      {
        name: 'Bibs',
        path: '/'
      },
      {
        name: 'Diapers',
        path: '/'
      },
      {
        name: 'Bathing Tub',
        path: '/'
      },
      {
        name: 'Bathing Safety',
        path: '/'
      },
      {
        name: 'Towels',
        path: '/'
      },
      {
        name: 'Walkers',
        path: '/'
      },
      {
        name: 'Swings',
        path: '/'
      },
      {
        name: 'Jumpers',
        path: '/'
      }
    ]
  },
  {
    name: 'Royalty',
    path: 'categories/Royalty',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ',
    image: royalty,
    image2: mc,
    svg: catfash,
    categories: [
      {
        name: 'Bead',
        path: '/'
      },
      {
        name: 'Walking Stick',
        path: '/'
      },
      {
        name: 'Staff',
        path: '/'
      },
      {
        name: 'Capes',
        path: '/'
      },
      {
        name: 'Crown',
        path: '/'
      },
      {
        name: 'Hair Pin',
        path: '/'
      },
      {
        name: 'Fan',
        path: '/'
      },
      {
        name: 'Anklet',
        path: '/'
      },
      {
        name: 'Bracelet',
        path: '/'
      }
    ]
  }
]

export const socialIcon = [
  {
    name: 'Facebook',
    icon: Social,
    link: '#'
  },
  {
    name: 'x',
    icon: Social1,
    link: '#'
  },
  {
    name: 'Instagram',
    icon: Social2,
    link: '#'
  },
  {
    name: 'Youtube',
    icon: Social3,
    link: '#'
  },
  {
    name: 'LinkedIn',
    icon: Social4,
    link: '#'
  }
]

export const quickLinks = [
  {
    name: 'Home',
    links: '/'
  },
  {
    name: 'Auction Deals',
    links: '/auction'
  },
  {
    name: 'Category',
    links: '/categories'
  },
  {
    name: 'Ralfle Draw Process',
    links: '/raffle'
  }
]

export const ourCompany = [
  {
    name: 'Contact us',
    links: '/contactUs'
  },
  {
    name: 'About Us',
    links: '/aboutUs'
  },
  {
    name: 'FAQ',
    links: '/faq'
  }
]
export const getInTouch = [
  {
    name: '1, Praisehill estate, Arepo, ogun State',
    links: '',
    icon: <IoLocationOutline />
  },
  {
    name: '(+234) 9169 881 005',
    links: '',
    icon: <FiPhoneCall />
  },
  {
    name: 'Support@goprus.com',
    links: '',
    icon: <LuMail />
  }
]

export const marqueeInfo = [
  'Follow us on all our social media platforms : www.ajiroba.com.',
  'Buy a ticket now and stand a chance to win ',
  'your preferred goods in our raffle draw.'
]


export const demoProducts = [

  {
    discount: "500.00",
    id: "ea116232-39d8-457d-8d04-5b00bc2783ec",
    images: ['/images/product1.png', '/images/product2.png', '/images/product3.png', '/images/product4.png'],
    name: "Fruit Sixteen",
    price: "1200.00",
    reviews: 0
  },
  {
    discount: "600.00",
    id: "ea116232-39d8-457d-8d04-5b00bc2783ec",
    images: ['/images/product1.png', '/images/product2.png', '/images/product3.png', '/images/product4.png'],
    name: "Fruit Sixteen",
    price: "200.00",
    reviews: 2
  },
  {
    discount: "500.00",
    id: "ea116232-39d8-457d-8d04-5b00bc2783ec",
    images: ['/images/product1.png', '/images/product2.png', '/images/product3.png', '/images/product4.png'],
    name: "Fruit Sixteen",
    price: "1600.00",
    reviews: 8
  },

]

export const Products = [

  {
    name: 'human hair',
    image: product1,
    description: '',
    price: '100,000',
    previousPrice: '400,000',
    rating: '',
    time: '',
    category: 'Fashion',
    subCategory: 'Women',
    tag: ['open']
  },
  {
    name: 'Rice',
    image: product2,
    description: '',
    price: '1000',
    previousPrice: '20,000',
    time: '',
    rating: '',
    category: 'FoodStuff',
    subCategory: 'Food',

    tag: ['open']

  },
  {
    name: 'Orange',
    image: product2,
    description: '',
    price: '1000',
    previousPrice: '20,000',
    time: '',
    rating: '',
    category: 'FoodStuff',
    subCategory: 'Fruits',

    tag: ['close']

  },
  {
    name: 'Smart Watch',
    image: product3,
    description: '',
    price: '10,000',
    previousPrice: '400,000',
    rating: '',
    time: '',
    category: 'Fashion And Beauty',
    subCategory: 'Smart',

    tag: ['open']

  },
  {
    name: 'Head Phone',
    image: product4,
    description: '',
    price: '20,000',
    previousPrice: '40,000',
    time: '',
    rating: '',
    category: 'Phones',
    subCategory: 'Smart',

    tag: ['close', 'redeem items', 'winning advise']

  },
  {
    name: 'Washing Machine',
    image: product5,
    description: '',
    price: '200,000',
    previousPrice: '500,000',
    rating: '',
    time: '',
    category: 'Electronic',
    subCategory: 'Smart',

    tag: ['close', 'redeem items', 'winning advise']

  },
  {
    name: 'Iphone XR',
    image: product6,
    description: '',
    price: '120,000',
    previousPrice: '700,000',
    time: '',
    rating: '',
    category: 'Phones',
    subCategory: 'Smart',

    tag: ['close', 'redeem items', 'winning advise']

  },
  {
    name: 'beads',
    image: product7,
    description: '',
    price: '2000',
    previousPrice: '5000',
    rating: '',
    time: '',
    category: 'Fashion And Beauty',
    subCategory: 'Accessories',

    tag: ['delivered', 'close']

  },
  {
    name: 'Bead',
    image: product8,
    description: '',
    price: '120,000',
    previousPrice: '400,000',
    time: '',
    rating: '',
    category: 'Phones',
    subCategory: 'Smart',

    tag: ['close', 'redeem items', 'winning advise']

  },
  {
    name: 'human hair',
    image: product1,
    description: '',
    price: '200,000',
    previousPrice: '600,000',
    rating: '',
    time: '',
    category: 'Fashion',

    tag: ['open']

  },
  {
    name: 'Oloyin Beans',
    image: product2,
    description: '',
    price: '5000',
    previousPrice: '7000',
    time: '',
    rating: '',
    category: 'FoodStuff'
  },
  {
    name: 'Smart Watch',
    image: product3,
    description: '',
    price: '2500',
    previousPrice: '5000',
    rating: '',
    time: '',
    category: 'Phones'
  },
  {
    name: 'Head Phone',
    image: product4,
    description: '',
    price: '1500',
    previousPrice: '4000',
    time: '',
    rating: '',
    category: 'Phone'
  }
]

export const RelatedData = [
  {
    name: 'human hair',
    image: product1,
    description: '',
    price: '100,000',
    previousPrice: '400,000',
    rating: '',
    time: '',
    category: 'Fashion',
    subCategory: 'Women'
  },
  {
    name: 'Rice',
    image: product2,
    description: '',
    price: '1000',
    previousPrice: '20,000',
    time: '',
    rating: '',
    category: 'FoodStuff',
    subCategory: 'Food'
  },
  {
    name: 'Orange',
    image: product2,
    description: '',
    price: '1000',
    previousPrice: '20,000',
    time: '',
    rating: '',
    category: 'FoodStuff',
    subCategory: 'Fruits'
  }
]

export const faq = [

  {
    question: 'How does raffle draw work on your platform?',
    answer: [
        "1. Create a profile and provide the basic KYC.",
        "2. Fund your wallet.",
        "3. Check the list of items we have on sale by raffle.",
        "4. Select your item of choice",
        "5. Make payment through your wallet for ticket for the item (s) you have selected",
        "6. You confirm your order",
        "7. Then you submit",
        "8. You are immidiately in the raffle draw pool",
        "9. At the specified time for the item you selected, a raffle draw will take place",
        "10. You get a prompt to watch the raffle draw life",
        "11. If your ticket wins, you will get a winning confirmation advice/letter sent to your registered email and also to your dashboard on the platform",
        "12. You can specify your preferred mode of redeeming your winning"
    ]
  },
  {
    question: 'Are the raffle draw conducted fairly?',
    answer: ["Yes, the raffle draw process is absolutely conducted digitally without any form of human involvement. Every one has an equal chance of being a winner"]
  },
  {
    question: 'What kind of price can I expect to win?',
    answer: ["The prize you will win is the product you have selected on the platform. It is either we deliver the actual product to you or we give you a gift voucher equal to the prevailing face value of the product of the product which you can now use to redeem the product at any of our nominated redemption stores."]
  },
  {
    question: 'How do I know if I have won?',
    answer: ["The moment you win, a winning confirmation advice/letter will be sent to your registered email and your customer dashboard on the platform."]
  },
  {
    question: 'Is there a limit to the number of ticket i can buy?',
    answer: ["There is no limit to the number of tickets you can buy for a product. You can buy as many tickets as possible in order for you to increase your chances of winning."]
  },
  {
    question:
      'What measure do you take to protect user privacy and data security?',
    answer: ["We take maximum care to ensure your data is not abused. Your data with us is used only for the purpose for which it is gathered and intended."]
  },
  {
    question:
      'Can I participate in the raffle draw from anywhere in the world?',
    answer: [" Yes, your location is not a barrier. You can participate in our raffle draws from anywhere in the world "]
  },
  {
    question:
      'How can I contact customer support if I have further questions or concerns?',
    answer: ["You can reach our customer support through",
      "+234-9169-881-005",
       "support@ajiroba.com"]
  }
]

import { FaSquarePhone } from 'react-icons/fa6'
import { CgData } from 'react-icons/cg'
import { PiTelevisionSimple } from 'react-icons/pi'
import { RiLightbulbFlashFill } from 'react-icons/ri'
import { RxDashboard } from 'react-icons/rx'
export const UserMenu = [
  {
    name: 'Dashboard',
    icon: <RxDashboard />
  },
  {
    name: 'Airtime',
    icon: <FaSquarePhone />
  },
  {
    name: 'Data',
    icon: <CgData />
  },
  {
    name: 'Cable Subscription',
    icon: <PiTelevisionSimple />
  },
  {
    name: 'Electricity',
    icon: <RiLightbulbFlashFill />
  }
]
import { RxFileText } from 'react-icons/rx'
import { IoReceiptOutline } from 'react-icons/io5'
import { BsCreditCard2Back } from 'react-icons/bs'

export const stepperList = [
  {
    name: 'Enter Details',
    icons: <RxFileText />
  },
  {
    name: 'Payment',
    icons: <BsCreditCard2Back />
  },
  {
    name: 'Receipts',
    icons: <IoReceiptOutline />
  }
]

export const transactions = [
  {
    logo: '',
    title: 'You just Bought ₦200 MTN Airtime',
    amount: '200',
    time: '3:15',
    status: ['pending'],
    type: 'purchase',

    brand: 'MTN'
  },
  {
    logo: '',

    brand: 'IKEDC',
    title: 'You just Bought 3000 unit',
    amount: '1000',
    time: '3:15',
    status: ['completed'],
    type: 'purchase'
  },
  {

    logo: '',

    brand: 'MTN',
    title: 'You just Bought ₦200 MTN Airtime',
    amount: '200',
    time: '3:15',
    status: ['delivered'],
    type: 'purchase'
  },
  {

    logo: '',

    brand: 'GTB',
    title: 'You just Received ₦ 20,0000',
    amount: '20,000',
    time: '3:15',
    status: ['completed'],
    type: 'received'
  },

    {

    logo: '',

    brand: 'GTB',
    title: 'You just Received ₦ 20,0000',
    amount: '20,000',
    time: '3:15',
    status: ['completed'],
    type: 'received'
  },
    {

    logo: '',

    brand: 'GTB',
    title: 'You just Received ₦ 20,0000',
    amount: '20,000',
    time: '3:15',
    status: ['completed'],
    type: 'received'
  }

  ,
    {

    logo: '',

    brand: 'GTB',
    title: 'You just Received ₦ 20,0000',
    amount: '20,000',
    time: '3:15',
    status: ['completed'],
    type: 'received'
  }
]

export const raffle = [
  {
    name: 'live raffle draw',
    video: raf,
    description:
      'Mama Gold Rice: Premium quality, long-grain rice known for its delicious taste and distinctive aroma. Aged to perfection, it guarantees a fluffy and flavorful result...',
    title: 'rice',
    host: 'ajiroba',
    date: '4 Aug 2024',

    price: "300"
  },
  {

    name: 'live raffle draw',
    video: raf,
    description:
      'Mama Gold Rice: Premium quality, long-grain rice known for its delicious taste and distinctive aroma. Aged to perfection, it guarantees a fluffy and flavorful result...',
    title: 'rice',
    host: 'ajiroba-2',
    date: '4 Aug 2024',

    price: "300"
  },
  {

    name: 'live raffle draw',
    video: raf,
    description:
      'Mama Gold Rice: Premium quality, long-grain rice known for its delicious taste and distinctive aroma. Aged to perfection, it guarantees a fluffy and flavorful result...',
    title: 'rice',
    host: 'ajiroba-3',
    date: '4 Aug 2024',

    price: "300"

  }
]

export const raffleWinner = [
  {

    sn: 0,
    product: "50kg Bag of Rice",
    winner: "09023233443",
    ticket: "500",
    number: 1
  },
  {
    sn: 1,
    product: "50kg Bag of Semo",
    winner: "09023233443",
    ticket: "500",
     number: 2
  },
  {
    sn: 2,
    product: "50kg Bag of Rice",
    winner: "09023233443",
    ticket: "500",
     number: 3
  }
]


export const state_and_LGA = [
  {
    "state": "Abia",
    "lgas": [
      "Aba North",
      "Aba South",
      "Arochukwu",
      "Bende",
      "Ikwuano",
      "Isiala Ngwa North",
      "Isiala Ngwa South",
      "Isuikwuato",
      "Obi Ngwa",
      "Ohafia",
      "Osisioma",
      "Ugwunagbo",
      "Ukwa East",
      "Ukwa West",
      "Umuahia North",
      "Umuahia South",
      "Umu Nneochi"
    ]
  },
  {
    "state": "Adamawa",
    "lgas": [
      "Demsa",
      "Fufure",
      "Ganye",
      "Gayuk",
      "Gombi",
      "Grie",
      "Hong",
      "Jada",
      "Lamurde",
      "Madagali",
      "Maiha",
      "Mayo Belwa",
      "Michika",
      "Mubi North",
      "Mubi South",
      "Numan",
      "Shelleng",
      "Song",
      "Toungo",
      "Yola North",
      "Yola South"
    ]
  },
  {
    "state": "Akwa Ibom",
    "lgas": [
      "Abak",
      "Eastern Obolo",
      "Eket",
      "Esit Eket",
      "Essien Udim",
      "Etim Ekpo",
      "Etinan",
      "Ibeno",
      "Ibesikpo Asutan",
      "Ibiono-Ibom",
      "Ika",
      "Ikono",
      "Ikot Abasi",
      "Ikot Ekpene",
      "Ini",
      "Itu",
      "Mbo",
      "Mkpat-Enin",
      "Nsit-Atai",
      "Nsit-Ibom",
      "Nsit-Ubium",
      "Obot Akara",
      "Okobo",
      "Onna",
      "Oron",
      "Oruk Anam",
      "Udung-Uko",
      "Ukanafun",
      "Uruan",
      "Urue-Offong/Oruko",
      "Uyo"
    ]
  },
  {
    "state": "Anambra",
    "lgas": [
      "Aguata",
      "Anambra East",
      "Anambra West",
      "Anaocha",
      "Awka North",
      "Awka South",
      "Ayamelum",
      "Dunukofia",
      "Ekwusigo",
      "Idemili North",
      "Idemili South",
      "Ihiala",
      "Njikoka",
      "Nnewi North",
      "Nnewi South",
      "Ogbaru",
      "Onitsha North",
      "Onitsha South",
      "Orumba North",
      "Orumba South",
      "Oyi"
    ]
  },
  {
    "state": "Bauchi",
    "lgas": [
      "Alkaleri",
      "Bauchi",
      "Bogoro",
      "Damban",
      "Darazo",
      "Dass",
      "Gamawa",
      "Ganjuwa",
      "Giade",
      "Itas/Gadau",
      "Jama'are",
      "Katagum",
      "Kirfi",
      "Misau",
      "Ningi",
      "Shira",
      "Tafawa Balewa",
      "Toro",
      "Warji",
      "Zaki"
    ]
  },
  {
    "state": "Bayelsa",
    "lgas": [
      "Brass",
      "Ekeremor",
      "Kolokuma/Opokuma",
      "Nembe",
      "Ogbia",
      "Sagbama",
      "Southern Ijaw",
      "Yenagoa"
    ]
  },
  {
    "state": "Benue",
    "lgas": [
      "Ado",
      "Agatu",
      "Apa",
      "Buruku",
      "Gboko",
      "Guma",
      "Gwer East",
      "Gwer West",
      "Katsina-Ala",
      "Konshisha",
      "Kwande",
      "Logo",
      "Makurdi",
      "Obi",
      "Ogbadibo",
      "Ohimini",
      "Oju",
      "Okpokwu",
      "Otukpo",
      "Tarka",
      "Ukum",
      "Ushongo",
      "Vandeikya"
    ]
  },
  {
    "state": "Borno",
    "lgas": [
      "Abadam",
      "Askira/Uba",
      "Bama",
      "Bayo",
      "Biu",
      "Chibok",
      "Damboa",
      "Dikwa",
      "Gubio",
      "Guzamala",
      "Gwoza",
      "Hawul",
      "Jere",
      "Kaga",
      "Kala/Balge",
      "Konduga",
      "Kukawa",
      "Kwaya Kusar",
      "Mafa",
      "Magumeri",
      "Maiduguri",
      "Marte",
      "Mobbar",
      "Monguno",
      "Ngala",
      "Nganzai",
      "Shani"
    ]
  },
  {
    "state": "Cross River",
    "lgas": [
      "Abi",
      "Akamkpa",
      "Akpabuyo",
      "Bakassi",
      "Bekwarra",
      "Biase",
      "Boki",
      "Calabar Municipal",
      "Calabar South",
      "Etung",
      "Ikom",
      "Obanliku",
      "Obubra",
      "Obudu",
      "Odukpani",
      "Ogoja",
      "Yakuur",
      "Yala"
    ]
  },
  {
    "state": "Delta",
    "lgas": [
      "Aniocha North",
      "Aniocha South",
      "Bomadi",
      "Burutu",
      "Ethiope East",
      "Ethiope West",
      "Ika North East",
      "Ika South",
      "Isoko North",
      "Isoko South",
      "Ndokwa East",
      "Ndokwa West",
      "Okpe",
      "Oshimili North",
      "Oshimili South",
      "Patani",
      "Sapele",
      "Udu",
      "Ughelli North",
      "Ughelli South",
      "Ukwuani",
      "Uvwie",
      "Warri North",
      "Warri South",
      "Warri South West"
    ]
  },
  {
    "state": "Ebonyi",
    "lgas": [
      "Abakaliki",
      "Afikpo North",
      "Afikpo South",
      "Ebonyi",
      "Ezza North",
      "Ezza South",
      "Ikwo",
      "Ishielu",
      "Ivo",
      "Izzi",
      "Ohaozara",
      "Ohaukwu",
      "Onicha"
    ]
  },
  {
    "state": "Edo",
    "lgas": [
      "Akoko-Edo",
      "Egor",
      "Esan Central",
      "Esan North-East",
      "Esan South-East",
      "Esan West",
      "Etsako Central",
      "Etsako East",
      "Etsako West",
      "Igueben",
      "Ikpoba-Okha",
      "Oredo",
      "Orhionmwon",
      "Ovia North-East",
      "Ovia South-West",
      "Owan East",
      "Owan West",
      "Uhunmwonde"
    ]
  },
  {
    "state": "Ekiti",
    "lgas": [
      "Ado Ekiti",
      "Efon",
      "Ekiti East",
      "Ekiti South-West",
      "Ekiti West",
      "Emure",
      "Gbonyin",
      "Ido Osi",
      "Ijero",
      "Ikere",
      "Ikole",
      "Ilejemeje",
      "Irepodun/Ifelodun",
      "Ise/Orun",
      "Moba",
      "Oye"
    ]
  },
  {
    "state": "Enugu",
    "lgas": [
      "Aninri",
      "Awgu",
      "Enugu East",
      "Enugu North",
      "Enugu South",
      "Ezeagu",
      "Igbo Etiti",
      "Igbo Eze North",
      "Igbo Eze South",
      "Isi Uzo",
      "Nkanu East",
      "Nkanu West",
      "Nsukka",
      "Oji River",
      "Udenu",
      "Udi",
      "Uzo Uwani"
    ]
  },
  {
    "state": "Gombe",
    "lgas": [
      "Akko",
      "Balanga",
      "Billiri",
      "Dukku",
      "Funakaye",
      "Gombe",
      "Kaltungo",
      "Kwami",
      "Nafada",
      "Shongom",
      "Yamaltu/Deba"
    ]
  },
  {
    "state": "Imo",
    "lgas": [
      "Aboh Mbaise",
      "Ahiazu Mbaise",
      "Ehime Mbano",
      "Ezinihitte",
      "Ideato North",
      "Ideato South",
      "Ihitte/Uboma",
      "Ikeduru",
      "Isiala Mbano",
      "Isu",
      "Mbaitoli",
      "Ngor Okpala",
      "Njaba",
      "Nkwerre",
      "Nwangele",
      "Obowo",
      "Oguta",
      "Ohaji/Egbema",
      "Okigwe",
      "Onuimo",
      "Orlu",
      "Orsu",
      "Oru East",
      "Oru West",
      "Owerri Municipal",
      "Owerri North",
      "Owerri West"
    ]
  },
  {
    "state": "Jigawa",
    "lgas": [
      "Auyo",
      "Babura",
      "Biriniwa",
      "Birnin Kudu",
      "Buji",
      "Dutse",
      "Gagarawa",
      "Garki",
      "Gumel",
      "Guri",
      "Gwaram",
      "Gwiwa",
      "Hadejia",
      "Jahun",
      "Kafin Hausa",
      "Kaugama",
      "Kazaure",
      "Kiri Kasama",
      "Kiyawa",
      "Maigatari",
      "Malam Madori",
      "Miga",
      "Ringim",
      "Roni",
      "Sule Tankarkar",
      "Taura",
      "Yankwashi"
    ]
  },
  {
    "state": "Kaduna",
    "lgas": [
      "Birnin Gwari",
      "Chikun",
      "Giwa",
      "Igabi",
      "Ikara",
      "Jaba",
      "Jema'a",
      "Kachia",
      "Kaduna North",
      "Kaduna South",
      "Kagarko",
      "Kajuru",
      "Kaura",
      "Kauru",
      "Kubau",
      "Kudan",
      "Lere",
      "Makarfi",
      "Sabon Gari",
      "Sanga",
      "Soba",
      "Zangon Kataf",
      "Zaria"
    ]
  },
  {
    "state": "Kano",
    "lgas": [
      "Ajingi",
      "Albasu",
      "Bagwai",
      "Bebeji",
      "Bichi",
      "Bunkure",
      "Dala",
      "Dambatta",
      "Dawakin Kudu",
      "Dawakin Tofa",
      "Doguwa",
      "Fagge",
      "Gabasawa",
      "Garko",
      "Garun Mallam",
      "Gaya",
      "Gezawa",
      "Gwale",
      "Gwarzo",
      "Kabo",
      "Kano Municipal",
      "Karaye",
      "Kibiya",
      "Kiru",
      "Kumbotso",
      "Kunchi",
      "Kura",
      "Madobi",
      "Makoda",
      "Minjibir",
      "Nasarawa",
      "Rano",
      "Rimin Gado",
      "Rogo",
      "Shanono",
      "Sumaila",
      "Takai",
      "Tarauni",
      "Tofa",
      "Tsanyawa",
      "Tudun Wada",
      "Ungogo",
      "Warawa",
      "Wudil"
    ]
  },
  {
    "state": "Katsina",
    "lgas": [
      "Bakori",
      "Batagarawa",
      "Batsari",
      "Baure",
      "Bindawa",
      "Charanchi",
      "Dandume",
      "Danja",
      "Dan Musa",
      "Daura",
      "Dutsi",
      "Dutsin Ma",
      "Faskari",
      "Funtua",
      "Ingawa",
      "Jibia",
      "Kafur",
      "Kaita",
      "Kankara",
      "Kankia",
      "Katsina",
      "Kurfi",
      "Kusada",
      "Mai'Adua",
      "Malumfashi",
      "Mani",
      "Mashi",
      "Matazu",
      "Musawa",
      "Rimi",
      "Sabuwa",
      "Safana",
      "Sandamu",
      "Zango"
    ]
  },
  {
    "state": "Kebbi",
    "lgas": [
      "Aleiro",
      "Arewa Dandi",
      "Argungu",
      "Augie",
      "Bagudo",
      "Birnin Kebbi",
      "Bunza",
      "Dandi",
      "Fakai",
      "Gwandu",
      "Jega",
      "Kalgo",
      "Koko/Besse",
      "Maiyama",
      "Ngaski",
      "Sakaba",
      "Shanga",
      "Suru",
      "Wasagu/Danko",
      "Yauri",
      "Zuru"
    ]
  },
  {
    "state": "Kogi",
    "lgas": [
      "Adavi",
      "Ajaokuta",
      "Ankpa",
      "Bassa",
      "Dekina",
      "Ibaji",
      "Idah",
      "Igalamela Odolu",
      "Ijumu",
      "Kabba/Bunu",
      "Kogi",
      "Lokoja",
      "Mopa Muro",
      "Ofu",
      "Ogori/Magongo",
      "Okehi",
      "Okene",
      "Olamaboro",
      "Omala",
      "Yagba East",
      "Yagba West"
    ]
  },
  {
    "state": "Kwara",
    "lgas": [
      "Asa",
      "Baruten",
      "Edu",
      "Ekiti",
      "Ifelodun",
      "Ilorin East",
      "Ilorin South",
      "Ilorin West",
      "Irepodun",
      "Isin",
      "Kaiama",
      "Moro",
      "Offa",
      "Oke Ero",
      "Oyun",
      "Pategi"
    ]
  },
  {
    "state": "Lagos",
    "lgas": [
      "Agege",
      "Ajeromi-Ifelodun",
      "Alimosho",
      "Amuwo-Odofin",
      "Apapa",
      "Badagry",
      "Epe",
      "Eti Osa",
      "Ibeju-Lekki",
      "Ifako-Ijaiye",
      "Ikeja",
      "Ikorodu",
      "Kosofe",
      "Lagos Island",
      "Lagos Mainland",
      "Mushin",
      "Ojo",
      "Oshodi-Isolo",
      "Shomolu",
      "Surulere"
    ]
  },
  {
    "state": "Nasarawa",
    "lgas": [
      "Akwanga",
      "Awe",
      "Doma",
      "Karu",
      "Keana",
      "Keffi",
      "Kokona",
      "Lafia",
      "Nasarawa",
      "Nasarawa Egon",
      "Obi",
      "Toto",
      "Wamba"
    ]
  },
  {
    "state": "Niger",
    "lgas": [
      "Agaie",
      "Agwara",
      "Bida",
      "Borgu",
      "Bosso",
      "Chanchaga",
      "Edati",
      "Gbako",
      "Gurara",
      "Katcha",
      "Kontagora",
      "Lapai",
      "Lavun",
      "Magama",
      "Mariga",
      "Mashegu",
      "Mokwa",
      "Muya",
      "Paikoro",
      "Rafi",
      "Rijau",
      "Shiroro",
      "Suleja",
      "Tafa",
      "Wushishi"
    ]
  },
  {
    "state": "Ogun",
    "lgas": [
      "Abeokuta North",
      "Abeokuta South",
      "Ado-Odo/Ota",
      "Ewekoro",
      "Ifo",
      "Ijebu East",
      "Ijebu North",
      "Ijebu North East",
      "Ijebu Ode",
      "Ikenne",
      "Imeko Afon",
      "Ipokia",
      "Obafemi Owode",
      "Odogbolu",
      "Ogun Waterside",
      "Remo North",
      "Shagamu",
      "Yewa North",
      "Yewa South"
    ]
  },
  {
    "state": "Ondo",
    "lgas": [
      "Akoko North-East",
      "Akoko North-West",
      "Akoko South-East",
      "Akoko South-West",
      "Akure North",
      "Akure South",
      "Ese Odo",
      "Idanre",
      "Ifedore",
      "Ilaje",
      "Ile Oluji/Okeigbo",
      "Irele",
      "Odigbo",
      "Okitipupa",
      "Ondo East",
      "Ondo West",
      "Ose",
      "Owo"
    ]
  },
  {
    "state": "Osun",
    "lgas": [
      "Aiyedaade",
      "Aiyedire",
      "Atakunmosa East",
      "Atakunmosa West",
      "Boluwaduro",
      "Boripe",
      "Ede North",
      "Ede South",
      "Egbedore",
      "Ejigbo",
      "Ife Central",
      "Ife East",
      "Ife North",
      "Ife South",
      "Ifedayo",
      "Ifelodun",
      "Ila",
      "Ilesa East",
      "Ilesa West",
      "Irepodun",
      "Irewole",
      "Isokan",
      "Iwo",
      "Obokun",
      "Odo Otin",
      "Ola Oluwa",
      "Olorunda",
      "Oriade",
      "Orolu",
      "Osogbo"
    ]
  },
  {
    "state": "Oyo",
    "lgas": [
      "Afijio",
      "Akinyele",
      "Atiba",
      "Atisbo",
      "Egbeda",
      "Ibadan North",
      "Ibadan North-East",
      "Ibadan North-West",
      "Ibadan South-East",
      "Ibadan South-West",
      "Ibarapa Central",
      "Ibarapa East",
      "Ibarapa North",
      "Ido",
      "Irepo",
      "Iseyin",
      "Itesiwaju",
      "Iwajowa",
      "Kajola",
      "Lagelu",
      "Ogbomosho North",
      "Ogbomosho South",
      "Ogo Oluwa",
      "Olorunsogo",
      "Oluyole",
      "Ona Ara",
      "Orelope",
      "Ori Ire",
      "Oyo East",
      "Oyo West",
      "Saki East",
      "Saki West",
      "Surulere"
    ]
  },
  {
    "state": "Plateau",
    "lgas": [
      "Bokkos",
      "Barkin Ladi",
      "Bassa",
      "Jos East",
      "Jos North",
      "Jos South",
      "Kanam",
      "Kanke",
      "Langtang North",
      "Langtang South",
      "Mangu",
      "Mikang",
      "Pankshin",
      "Qua'an Pan",
      "Riyom",
      "Shendam",
      "Wase"
    ]
  },
  {
    "state": "Rivers",
    "lgas": [
      "Abua/Odual",
      "Ahoada East",
      "Ahoada West",
      "Akuku-Toru",
      "Andoni",
      "Asari-Toru",
      "Bonny",
      "Degema",
      "Eleme",
      "Emohua",
      "Etche",
      "Gokana",
      "Ikwerre",
      "Khana",
      "Obio/Akpor",
      "Ogba/Egbema/Ndoni",
      "Ogu/Bolo",
      "Okrika",
      "Omuma",
      "Opobo/Nkoro",
      "Oyigbo",
      "Port Harcourt",
      "Tai"
    ]
  },
  {
    "state": "Sokoto",
    "lgas": [
      "Binji",
      "Bodinga",
      "Dange Shuni",
      "Gada",
      "Goronyo",
      "Gudu",
      "Gwadabawa",
      "Illela",
      "Isa",
      "Kebbe",
      "Kware",
      "Rabah",
      "Sabon Birni",
      "Shagari",
      "Silame",
      "Sokoto North",
      "Sokoto South",
      "Tambuwal",
      "Tangaza",
      "Tureta",
      "Wamako",
      "Wurno",
      "Yabo"
    ]
  },
  {
    "state": "Taraba",
    "lgas": [
      "Ardo Kola",
      "Bali",
      "Donga",
      "Gashaka",
      "Gassol",
      "Ibi",
      "Jalingo",
      "Karim Lamido",
      "Kumi",
      "Lau",
      "Sardauna",
      "Takum",
      "Ussa",
      "Wukari",
      "Yorro",
      "Zing"
    ]
  },
  {
    "state": "Yobe",
    "lgas": [
      "Bade",
      "Bursari",
      "Damaturu",
      "Fika",
      "Fune",
      "Geidam",
      "Gujba",
      "Gulani",
      "Jakusko",
      "Karasuwa",
      "Machina",
      "Nangere",
      "Nguru",
      "Potiskum",
      "Tarmuwa",
      "Yunusari",
      "Yusufari"
    ]
  },
  {
    "state": "Zamfara",
    "lgas": [
      "Anka",
      "Bakura",
      "Birnin Magaji/Kiyaw",
      "Bukkuyum",
      "Bungudu",
      "Gummi",
      "Gusau",
      "Kaura Namoda",
      "Maradun",
      "Maru",
      "Shinkafi",
      "Talata Mafara",
      "Chafe",
      "Zurmi"
    ]
  },
  {
    "state": "FCT - Abuja",
    "lgas": [
      "Abaji",
      "Bwari",
      "Gwagwalada",
      "Kuje",
      "Kwali",
      "Municipal Area Council"
    ]
  }
]





