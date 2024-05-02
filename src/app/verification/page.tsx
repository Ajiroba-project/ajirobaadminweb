"use client";
import Link from "next/link";
import { RegistrationHeader, HeaderTitle } from "../components/Header";
import Verify_icon from "../asset/verify.svg";
import Image from "next/image";
import { DefaultButton } from "../components/Button";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  const handleVerify = () => {
    router.push("/signin");
  };

  return (
    <>
      <div className="px-8">
        <RegistrationHeader />

        <section className="flex justify-center items-center mb-8 mt-20">
          <Image src={Verify_icon} alt="brand-logo" width={60} height={60} />
        </section>

        <HeaderTitle
          title="Verification Successful!"
          menu="Your Email address has ben verified"
        />

        <div className=" flex justify-center mb-20 mt-4 ">
          <div className="flex flex-col">
            <div className="flex justify-center items-center mx-3">
              <DefaultButton
                type="submit"
                className=" w-full bg-[#FCDFD4] py-4 text-sm"
                text="Proceed"
                handleClick={() => handleVerify()}
              />
            </div>

            <div className=" invisible flex justify-center items-center mt-4">
              <nav className="flex gap-2">
                <small className="text-base">Didn’t get email?</small>
                <small className="text-base">
                  <button
                    onClick={() => handleVerify()}
                    className="text-[#F25E26] text-sm"
                  >
                    Click to resend
                  </button>
                </small>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
