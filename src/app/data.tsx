import user from "@/app/asset/user-icon.svg"
import category from "@/app/asset/category-icon.svg"
import product from "@/app/asset/product-icon.svg"
import transaction from "@/app/asset/transaction-icon.svg"
import upload from "@/app/asset/upload-icon.svg"
import ag from "@/app/asset/ag.svg"
import tmg from "@/app/asset/tmg.svg"
import tns from "@/app/asset/tns.svg"
import ps from "@/app/asset/ps.svg"
import user_img from "@/app/asset/user.png"

export const SideNavMenu =[
    {
        name:"User Details",
        path:"#",
        icon:user
    },

     {
        name:"Upload",
        path:"#",
        icon:upload
    },
     {
        name:"Product",
        path:"#",
        icon:product
    },
    {
        name:"Category",
        path:"#",
        icon:category
    },
     {
        name:"Transaction",
        path:"#",
        icon:transaction
    },
]

export const HeaderNavMenu = [
    {
    name:"Community",
    path:"#",

}, {
    name:"Profile",
    path:"#",
    
},  {
    name:"Live Chat",
    path:"#",
    
}]

export const regularDetails =[
    {
        icon:tmg,
        name:"TOTAL REGISTERED USER",
        count: 0
    },
     {
        icon:tns,
        name:"TOTAL NUMBER OF SALES",
        count:0
    },
    {
        icon:ag,
        name:"AMOUNT GENERATED",
        count:0
    },
    {
        icon:ps,
        name:"PENDING SSALES",
        count:0
    },
]
export const auctionDetails =[
    {
        icon:tmg,
        name:"TOTAL REGISTERED USER",
        count: 0
    },
     {
        icon:tns,
        name:"TOTAL TICKET PURCHASED",
        count:0
    },
    {
        icon:ag,
        name:"TOTAL BID MADE",
        count:0
    },
    {
        icon:ps,
        name:"TOTAL AMOUNT GENERATED",
        count:0
    },
]

export const users =[{
    first_name:"Tonia ",
    surname:"Joe",
    email:"tonia@gmail.com",
    phone:"123456",
    city:"ikeja",
    address:"1, adeniyi jones, ikeja lagos ",
    ticketPurchase:"5",
    totalAmount:"1000",
    photo:user_img
}, 
{
    first_name:"John ",
    surname:"Deo",
    email:"john@gmail.com",
    phone:"123456",
    city:"Alimosho",
    address:"Alimosho Lagos",
    ticketPurchase:"2",
    totalAmount:"3000",
    photo:user_img
},
]

export const Categories =[{
    name:"FoodStuff",
    subcategories: [
      {
        name: 'Fruits',
        
      },
      {
        name: 'Vegetable',
 
      },
      {
        name: 'Tubers',
  
      },
      {
        name: 'Cereal',
       
      },
      {
        name: 'Legumes',
       
      },
      {
        name: 'Diary',
       
      },
      {
        name: 'Meat',
       
      }]
}, {
    name: 'Fashion and Beauty',    
    categories: [
      {
        name: `Men's Fashion`,
        subcategory: [
          { name: 'Snickers'},
          { name: 'Clothing'},
          { name: 'Underwear'},
          { name: 'T-shirt'},
          { name: 'Polo'},
          { name: 'knicker'},
          { name: 'Jewelry'},
          { name: 'Belt'}
        ]
      },
      {
        name: `Women's Fashion`,
        subcategory: [
          { name: 'Shoe' },
          { name: 'Clothing' },
          { name: 'Accessories' },
          { name: 'Hand Bag' },
          { name: 'Sleep Wear' },
          { name: 'Matanity' },
          { name: 'Dresses' },
          { name: 'Traditional' }
        ]
      },
      {
        name: `Accessories`,
        subcategory: [
          { name: 'Men Sunglasses', },
          { name: 'Men Watches', },
          { name: 'Women Sunglasses', },
          { name: 'Women Watches', }
        ]
      }
    ]
  },
]