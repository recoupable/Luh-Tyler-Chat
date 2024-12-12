"use client";

import { ArrowRight, X } from "lucide-react";
import Modal from "../Modal";
import useIsMobile from "@/hooks/useIsMobile";
import Icon from "../Icon";
import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";

const UnlockProModal = ({
  isModalOpen,
  toggleModal,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
}) => {
  const isMobile = useIsMobile();
  const { isPrepared } = useUserProvider();
  const { createCheckoutSession } = usePaymentProvider();

  const pay = async (productName: string, subscriptionActive: boolean) => {
    if (!isPrepared()) return;
    await createCheckoutSession(productName, subscriptionActive);
    return;
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          onClose={toggleModal}
          containerClasses="!p-0 !w-auto !border-none !rounded-xl !shadow-[1px_1px_8px_1px_#80808061]"
          className="!p-0 !border-none"
        >
          <div className="bg-[url('/brand.png')] md:w-[710px] md:h-[347px] bg-cover bg-center grid grid-cols-12 relative">
            <button
              className="hidden md:block absolute right-4 top-4"
              type="button"
              onClick={toggleModal}
            >
              <X className="text-grey-dark" />
            </button>
            <div className="bg-[url('/brand.png')] bg-cover bg-center md:bg-none col-span-12 md:col-span-6 font-inter_bold text-[45px] text-white p-6 leading-[120%] flex items-center relative">
              Secure <br />
              Brand Deals <br />
              While You <br />
              Sleep.
              <div className="absolute right-4 top-4">
                <Icon name="star-xl" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 bg-white flex justify-center flex-col p-6">
              <p className="font-plus_jakarta_sans_bold text-xl">
                Unlock {isMobile && "Recoup "}PRO
              </p>
              <p className="font-inter_bold text-6xl mt-3">
                $20<span className="font-inter_semibold text-sm">/m</span>
              </p>
              <p className="font-inter_medium text-xs mt-1">
                Pause or cancel anytime.
              </p>
              <div className="space-y-2 mt-4">
                <p className="font-inter_medium text-sm">
                  <span className="font-inter_bold">✔ Unlimited</span>{" "}
                  actionable fan insights.
                </p>
                <p className="font-inter_medium text-sm">
                  <span className="font-inter_bold">✔ Agent</span> working 24/7
                  to secure brand deals.
                </p>
                <p className="font-inter_medium text-sm">
                  <span className="font-inter_bold">✔ Save</span> time, earn
                  more, and scale effortlessly.
                </p>
              </div>
              <button
                type="button"
                className="flex gap-2 justify-center items-center bg-black rounded-lg text-white w-fit px-3 py-2 mt-3 mb-2 font-inter_bold text-sm"
                onClick={() => pay("Unlimited subscription", true)}
              >
                Activate Your AI Agent Today
                <ArrowRight className="size-5" />
              </button>
              <button
                className="font-inter_medium italic text-xs text-left"
                type="button"
                onClick={() => pay("1 Credit", false)}
              >
                Or unlock individual fan segment reports for $2
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UnlockProModal;
