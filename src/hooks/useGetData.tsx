import { useQuery, UseQueryResult } from '@tanstack/react-query'
import Axios from 'axios'

interface UserData {
  data: any
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  gender: boolean
  address: string
  state: string
  lga: string
  residential: string
  my_wallet: { balance: string; point: string }[]
  profile_image_url?: any
  amount?: any
  map?: any
  length?: any
  regular_deals?: any
  auction_deals?: any
  status?: any
  message?: any
  ticket_number?: any
  profile_image?: any
  name?: any
  bills_payment?: any
  infromation?: any
  product_info?: any
  winners_info?: any
  product_reviews?: any
  current_datetime?: any
  delivery_estimation?: any
  flatMap?: any
  total_auction_customers_GTV?: any
  service_uptime?: any
  total_amount_made?: any
  total_auction_customers?: any
  total_auction_trans?: any
  total_bills_trans?: any
  total_raffle_winner?: any
  total_regular_customers?: any
  total_regular_customers_GTV?: any
  total_regular_deals_trans?: any
  total_wallet_balance?: any
  no_of_customers?: any
  total_revenue?: any
  total_discount?: any
  cost_price_total?: any
  profit?: any
  raffle_draw_winning_volume?: any
  revenue_summary_report?: any
  // Auction summary fields
  revenue?: number
  total_tickets?: number
  rda?: number
  eca?: number

}

// Define the interface for the expected response data structure
interface ResponseData {
  data?: UserData
  completed?: UserData
  id: number
  title: string
  description: string
  profile_image_url?: any
  status: string
  message: string
  filter?: any
  slice?: any
  length?: any
  results?: any
  flatMap?: any
  winners_info?: any
}

// interface ApiResponse {
//   data: ResponseData[]; // Assuming the API returns an object with a data field containing an array of ResponseData
//   // Add other fields based on your API response
// }

interface ApiResponse {
  status: string
  message: string
  data?: UserData
  profile_image_url: string
  filter?: any
  slice?: any
  length?: any
}

// Define the fetch function with type annotations
const fetchDatanew = async (
  url: string,
  userToken: string,
  title?: string
): Promise<ResponseData> => {
  // console.log(title, url, userToken)
  const response = await Axios.get<ResponseData>(url, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  })
  return response.data
}

// Define the hook with type annotations
export const useGetDatanew = (
  url: string,
  title: string,
  userToken: string,
  p0?: { cacheTime?: number; staleTime?: number }
): UseQueryResult<ResponseData> => {
  return useQuery({
    queryKey: [title, url],
    queryFn: () => fetchDatanew(url, userToken),
    refetchOnWindowFocus: false
  })
}

// Define the fetch function with type annotations
const fetchOrderData = async (
  url: string,
  userToken: string,
  title?: string
): Promise<ResponseData> => {
  /*  console.log(title, url, userToken) */
  const response = await Axios.get<ResponseData>(url, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  })
  return response.data
}

// Define the hook with type annotations
export const useGetOrderData = (
  url: string,
  title: string,
  userToken: string
): UseQueryResult<ResponseData> => {
  return useQuery({
    queryKey: [title, url],
    queryFn: () => fetchOrderData(url, userToken, title),
    refetchOnWindowFocus: false
  })
}

// Define the fetch function with type annotations
const fetchPointData = async (
  url: string,
  userToken: string,
  title?: string
): Promise<ResponseData> => {
  /*  console.log(title, url, userToken) */
  const response = await Axios.get<ResponseData>(url, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  })
  return response.data
}

// Define the hook with type annotations
export const useGetPointData = (
  url: string,
  title: string,
  userToken: string
): UseQueryResult<ResponseData> => {
  return useQuery({
    queryKey: [title, url],
    queryFn: () => fetchPointData(url, userToken, title),
    refetchOnWindowFocus: false
  })
}

// Define the fetch function with type annotations
const fetchProductData = async (
  url: string,
  userToken: string,
  order_id: string,
  title?: string
): Promise<ResponseData> => {
  //  console.log(url, userToken, order_id, title);
  const response = await Axios.get<ResponseData>(url, {
    headers: {
      Authorization: `Token ${userToken}`,
      order_id: order_id
    }
  })
  return response.data
}

// Define the hook with type annotations
export const useGetProductData = (
  url: string,
  userToken: string,
  order_id: string,
  title: string
): UseQueryResult<ResponseData> => {
  /*  console.log(url, userToken, order_id, title); */
  return useQuery({
    queryKey: [title, url],
    queryFn: () => fetchProductData(url, userToken, order_id, title), // Correct parameter order
    refetchOnWindowFocus: false
  })
}

// Define the fetch function with type annotations
const fetchBidData = async (
  url: string,
  userToken: string,
  auction_id: string,
  title?: string
): Promise<ResponseData> => {
  //  console.log(url, userToken, order_id, title);
  const response = await Axios.get<ResponseData>(url, {
    headers: {
      Authorization: `Token ${userToken}`,
      auction_id: auction_id
    }
  })
  return response.data
}

// Define the hook with type annotations
export const useGetBidData = (
  url: string,
  userToken: string,
  order_id: string,
  title: string
): UseQueryResult<ResponseData> => {
  /*  console.log(url, userToken, order_id, title); */
  return useQuery({
    queryKey: [title, url],
    queryFn: () => fetchBidData(url, userToken, order_id, title), // Correct parameter order
    refetchOnWindowFocus: false
  })
}

// Define the fetch function with type annotations
const fetchOrderwinsData = async (
  url: string,
  userToken: string,
  title?: string
): Promise<ResponseData> => {
  /*  console.log(title, url, userToken) */
  const response = await Axios.get<ResponseData>(url, {
    headers: {
      Authorization: `Token ${userToken}`
    }
  })
  return response.data
}

// Define the hook with type annotations
export const useGetOrderWinsData = (
  url: string,
  title: string,
  userToken: string
): UseQueryResult<ResponseData> => {
  return useQuery({
    queryKey: [title, url],
    queryFn: () => fetchOrderwinsData(url, userToken, title),
    refetchOnWindowFocus: false
  })
}
