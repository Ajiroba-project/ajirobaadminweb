import React from "react";
import ReactPaginate from "react-paginate";

type PaginationProps = {
  pageCount: number;
  onPageChange: any;
  className?: string;
  pageRangeDisplayed?: number;
};

export const Pagination = ({
  pageCount,
  onPageChange,
  className,
  pageRangeDisplayed,
}: PaginationProps) => {
  return (
    <div className={``}>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={onPageChange}
        pageRangeDisplayed={pageRangeDisplayed || 3}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        className={className}
        // pageClassName="p-4 "
        pageLinkClassName="p-3 bg-[#B7B7B7] text-[#D2D2D2] text-lg"
        activeClassName="text-[#F25E26] border-[#f25e26] text-xl"
        nextClassName="p-3 bg-[#B7B7B7] text-[#D2D2D2] text-xl"
        previousClassName="p-3 bg-[#B7B7B7] text-[#D2D2D2] text-xl"
      />
    </div>
  );
};
