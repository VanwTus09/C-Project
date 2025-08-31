import React from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Chờ mình tí nhoa...",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90">
      {/* Logo rung lắc + nhấp nháy */}
      <motion.img
        src="/logoapp.webp"
        alt="logo"
        className="w-24"
        animate={{
          rotate: [0, -10, 10, -10, 10, 0],
          opacity: [0.5, 1, 0.5, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <p className="mt-6 text-gray-800 font-semibold">{message}</p>
    </div>
  );
};
