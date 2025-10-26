import { useStore } from "@/store/nav-store";
import { IconButton } from "@/app/component/Button";
import { MdOutlineFileDownload } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import Regulardeals from "./Regulardeals";
import Recharge from "./Recharge";
import Auctiondeals from "./Auctiondeals";
import Rechargedeals from "./Rechargedeals";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Axios from "axios";
import Cookies from "js-cookie";

export const Transaction = () => {
  const router = useRouter()
  const [active, setActive] = useState(2); // Set Recharge as default active
  const [exporter, setExporter] = useState<(() => void) | null>(null);
  const onRegisterExport = useCallback((fn: () => void) => {
    setExporter(() => fn);
  }, []);
  useEffect(() => {
    // reset exporter when switching tabs
    setExporter(null);
  }, [active]);
  useAuthMiddleware(router)

  // Warm up lazy-loaded table chunks to make tab switches instant
  useEffect(() => {
    // Preload tables used inside the tab components
    import('./RegularsDealTable');
    import('./RechargeDealsTable');
    import('@/app/components/AuctionDealsTable');
  }, []);

  // Prefetch data for all tabs so switching is instant
  const queryClient = useQueryClient();
  useEffect(() => {
    const token = Cookies.get("token") || " ";
    const base = process.env.NEXT_PUBLIC_BASE_URL;
    if (!base) return;

    const prefetch = (endpoint: string) => {
      const url = `${base}${endpoint}`;
      return queryClient.prefetchQuery({
        queryKey: ["get_catandsubcat_details", url],
        queryFn: async () => {
          const res = await Axios.get(url, {
            headers: { Authorization: `Token ${token}` }
          });
          return res.data;
        },
        staleTime: 5 * 60 * 1000,
      });
    };

    prefetch('/admin/product_transactions/');
    prefetch('/admin/auction_transactions/');
    prefetch('/admin/billpayment_transactions/');
    prefetch('/admin/transaction_volume/');
  }, [queryClient]);

  return (
    <div>
      <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-auto sticky top-0">
        <div className="flex justify-between py-6 px-12 flex-wrap gap-4">
          <div>
            <h1 className="xl:text-2xl 2xl:text-2xl md:text-2xl text-base font-bold leading-tight tracking-tight font-Poppins">
              Gross Transaction Volume
            </h1>
          </div>

          <div>
            <IconButton
              type="button"
              text="Export CSV"
              className=" text-sm flex items-center gap-2 rounded-lg bg-[#F25E26] p-3 capitalize text-white w-fit justify-items-center font-Poppins font-medium hover:bg-[#E84526] transition-colors duration-200"
              icon={
                <MdOutlineFileDownload className="text-base font-Poppins" />
              }
              handleClick={() => {
                if (exporter) {
                  exporter();
                } else {
                  alert('No export available for the current view.');
                }
              }}
            />
          </div>
        </div>

        <div className="flex gap-8 2xl:gap-14 xl:gap-14 lg:gap-14 md:gap-14 flex-wrap py-6 px-12">
          <div
            className={`${
              active == 0 ? "text-[#F25E26] border-b-2 border-[#F25E26] pb-2" : "text-[#667185] hover:text-[#F25E26]"
            } cursor-pointer transition-all duration-200 font-Poppins font-medium text-base`}
            onClick={() => setActive(0)}
          >
            <h1>Regular Deals</h1>
          </div>

          <div
            className={`${
              active == 1 ? "text-[#F25E26] border-b-2 border-[#F25E26] pb-2" : "text-[#667185] hover:text-[#F25E26]"
            } cursor-pointer transition-all duration-200 font-Poppins font-medium text-base`}
            onClick={() => setActive(1)}
          >
            <h1>Auction Deals</h1>
          </div>

          <div
            className={`${
              active == 2 ? "text-[#F25E26] border-b-2 border-[#F25E26] pb-2" : "text-[#667185] hover:text-[#F25E26]"
            } cursor-pointer transition-all duration-200 font-Poppins font-medium text-base`}
            onClick={() => setActive(2)}
          >
            <h1>Recharge</h1>
          </div>
        </div>
      </div>

      <div className="py-6 px-12">
        {active == 0 ? (
          <Regulardeals onRegisterExport={onRegisterExport} />
        ) : active == 1 ? (
          <Auctiondeals onRegisterExport={onRegisterExport} />
        ) : (
          <Rechargedeals onRegisterExport={onRegisterExport} />
        )}
      </div>
    </div>
  );
};
