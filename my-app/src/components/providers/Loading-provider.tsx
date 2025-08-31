"use client";

import React, { createContext, useContext, useState } from "react";
import { LoadingScreen } from "../modals";

interface LoadingContextProps {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>("");

  const showLoading = (msg?: string) => {
    setMessage(msg || "Chờ mình tí nhoa...");
    setIsOpen(true);
  };

  const hideLoading = () => {
    setIsOpen(false);
    setMessage("");
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {isOpen && <LoadingScreen message={message} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
};
