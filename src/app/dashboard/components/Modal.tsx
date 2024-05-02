import { HeaderTitle } from "@/app/components/Header";
import { DefaultButton } from "@/app/components/Button";
import Image from "next/image";

type signOutModalProps = {
  title: string;
  subtitle?: string;
  buttontext?: string;
  buttontype?: "button" | "submit" | "reset" | undefined;
  buttoncount?: 1 | 2;
  button2text?: string;
  button2type?: "button" | "submit" | "reset" | undefined;
  buttonclass?: string;
  button2class?: string;
  handleEvent?: any;
  handleEvent2?: any;
  icon?: any;
};

export const Modal = ({
  title,
  subtitle,
  buttontext,
  buttontype,
  buttoncount,
  buttonclass,
  button2class,
  button2type,
  button2text,
  icon,
  handleEvent,
  handleEvent2,
}: signOutModalProps) => {
  return (
    <section className="z-50 fixed w-screen h-screen bg-[#000000d1] flex justify-center items-center ">
      <div className="text-center p-8 flex flex-col bg-white rounded-md gap-6 justify-center items-center w-[20em] xs:w-[15em] lg:w-[30em] md:w-[25em] h-auto">
       {icon && <div className="py-2">
          <Image src={icon} width={60} height={60} alt="icon" />
        </div>}

        <div className="flex-col gap-2">
          <h1 className="text-2xl">{title}</h1>
          <p className=" mt-4 text-sm font-normal leading-6 text-center w-auto  text-[#353131]">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {buttoncount === 1 ? (
            <DefaultButton
              text={`${buttontext}`}
              type={buttontype || "button"}
              className={`${buttonclass} rounded-md w-full `}
              handleClick={handleEvent}
            />
          ) : (
            <div className="flex items-center gap-8 py-4 mt-10">
              <DefaultButton
                text={`${buttontext}`}
                type={buttontype || "button"}
                className={`${buttonclass} rounded-md w-full`}
                handleClick={handleEvent}
              />
              <DefaultButton
                text={`${button2text}`}
                type={button2type || "button"}
                className={`${button2class} rounded-md w-full`}
                handleClick={handleEvent2}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
