"use client";
import React from "react";
import pdficon from'@/app/asset/pdficon.svg';
import xlsicon from'@/app/asset/excelicon.svg';
import Image from "next/image";
interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPDF: () => void;
  onDownloadXLS: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  onDownloadPDF,
  onDownloadXLS,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-3xl p-12 max-w-lg w-full mx-4 relative"
        onClick={handleModalClick}
      >
        <h2 className="text-3xl font-semibold text-black mb-12 font-sans">
          Download as:
        </h2>

        <div className="flex gap-6">
          {/* PDF Button */}
          <button
            onClick={onDownloadPDF}
            className="flex-1 bg-[#E44D26] hover:bg-[#d63918] text-white rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-colors min-h-[140px]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg flex items-center justify-center">
                <Image src={pdficon} alt="PDF" width={32} height={32} />
              </div>
              <span className="text-2xl font-medium">PDF</span>
            </div>
          </button>

          {/* XLS Button */}
          <button
            onClick={onDownloadXLS}
            className="flex-1 bg-white border-2 border-[#E44D26] text-[#E44D26] hover:bg-[#E44D26] hover:text-white rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-colors min-h-[140px] group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg">
                <Image src={xlsicon} alt="XLS" width={32} height={32} />
              </div>
              <span className="text-2xl font-medium">XLS</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
