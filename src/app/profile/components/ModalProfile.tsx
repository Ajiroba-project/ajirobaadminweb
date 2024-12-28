import Image from 'next/image';
import React, { ReactNode } from 'react';
import { IoIosClose } from 'react-icons/io';

interface ModalProfileProps {
  isOpen: boolean;
  title?: string;
  icon?: string;
  children?: ReactNode;
  buttoncount?: number;
  buttontext?: string;
  buttonclass?: string;
  buttontype?: 'button' | 'submit' | 'reset';
  handleEvent?: () => void;
  onClose?: () => void;
}

export const ModalProfile: React.FC<ModalProfileProps> = ({
  isOpen,
  title,
  icon,
  children,
  onClose,
  buttoncount = 1,
  buttontext = 'Close',
  buttonclass = '',
  buttontype = 'button',
  handleEvent,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <section className="fixed left-0 top-0 z-50 flex h-full w-screen items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="mb-8 flex h-auto flex-col items-center justify-center gap-6 rounded-md bg-white p-8">
            {icon && <Image src={icon} alt="icon" />}
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            {children && <div className="my-4">{children}</div>}
            {/* <div className='mt-5 flex justify-center gap-4'>
              <button
                className={`rounded-md bg-[#F25E26] p-2 text-white ${buttonclass}`}
                type={buttontype}
                onClick={handleEvent || onClose}
              >
                {buttontext}
              </button>
            </div> */}
          </div>
        </section>
      )}
    </>
  );
};



export const ModalTerms: React.FC<ModalProfileProps> = ({
  isOpen,
  title,
  icon,
  children,
  onClose,
  buttoncount = 1,
  buttontext = 'Close',
  buttonclass = '',
  buttontype = 'button',
  handleEvent,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
      /*   <section className="fixed left-0 top-0 z-50 flex h-full w-screen items-center justify-center bg-black bg-opacity-50">
          <div className="mb-8 flex h-auto flex-col items-center justify-center gap-6 rounded-md bg-white ">
            {icon && <Image src={icon} alt="icon" />}
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            {children && <div className="">{children}</div>}

          </div>
        </section> */

        <section className="fixed left-0 top-0 z-50 flex h-full w-screen items-center justify-center bg-black bg-opacity-50">
  <div className="relative    flex flex-col items-center justify-center rounded-md bg-white max-h-[90vh] overflow-y-auto mb-8 w-full mx-4 sm:mx-8">
    {/* Optional: Add a close button */}
    <button
      className="absolute top-2 right-2 text-gray-500"
      onClick={onClose}
    >
    {/*   <IoIosClose size={32} /> */}
    </button>

    {/* Icon */}
    {icon && <Image src={icon} alt="icon" />}

    {/* Title */}
    {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

    {/* Scrollable Content */}
    <div className="w-full p-4 h-[100vh]" style={{}}>
      {children && <div>{children}</div>}
    </div>
  </div>
</section>

      )}
    </>
  );
};







