import { useState } from "react";
import { createSession } from "@/lib/stripe/createSession";
import { useParams } from "next/navigation";
import { useUserProvider } from "@/providers/UserProvder";
import { v4 as uuidV4 } from "uuid";

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const { chat_id: chatId } = useParams();
  const { userData } = useUserProvider();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successCallbackParams, setSuccessCallbackParams] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const createCheckoutSession = async (
    productName: string,
    subscriptionActive: boolean,
  ) => {
    const referenceId = uuidV4();
    const sessionResponse = await createSession(
      `${window.location.href}?referenceId=${referenceId}&${successCallbackParams || ""}`,
      productName,
      referenceId,
      subscriptionActive,
      {
        chatId: chatId as string,
        accountId: userData?.id,
      },
    );

    window.open(sessionResponse.url, "_self");
  };

  return {
    setSuccessCallbackParams,
    loading,
    setLoading,
    createCheckoutSession,
    isModalOpen,
    setIsModalOpen,
    toggleModal,
  };
};

export default usePayment;
