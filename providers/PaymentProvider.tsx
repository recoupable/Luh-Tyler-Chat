"use client";

import UnlockProModal from "@/components/UnlockProModal";
import usePayment from "@/hooks/usePayment";
import React, { createContext, useContext, useMemo, useState } from "react";

const PaymentContext = createContext<ReturnType<typeof usePayment>>(
  {} as ReturnType<typeof usePayment>,
);

const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const payment = usePayment();
  const value = useMemo(() => ({ ...payment }), [payment]);

  return (
    <PaymentContext.Provider value={value}>
      <UnlockProModal
        isModalOpen={payment.isModalOpen}
        toggleModal={payment.toggleModal}
      />
      {children}
    </PaymentContext.Provider>
  );
};

const usePaymentProvider = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentProvider must be used within a PaymentProvider");
  }
  return context;
};

export { PaymentProvider, usePaymentProvider };
