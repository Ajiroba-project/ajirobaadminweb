"use client";
import React from "react";

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-12 max-w-lg w-full mx-4 relative">
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <text x="8" y="16" fontSize="6" fill="white" fontWeight="bold">
                    PDF
                  </text>
                </svg>
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" fill="white" />
                  <rect x="8" y="12" width="8" height="1.5" fill="white" />
                  <rect x="8" y="14" width="8" height="1.5" fill="white" />
                  <rect x="8" y="16" width="8" height="1.5" fill="white" />
                  <text x="8" y="11" fontSize="4" fill="white" fontWeight="bold">
                    XLS
                  </text>
                </svg>
              </div>
              <span className="text-2xl font-medium">XLS</span>
            </div>
          </button>
        </div>

        {/* Close button - invisible but clickable overlay */}
        <button
          onClick={onClose}
          className="absolute inset-0 w-full h-full bg-transparent"
          style={{ zIndex: -1 }}
        />
      </div>
    </div>
  );
};
