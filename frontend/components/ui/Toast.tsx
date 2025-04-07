"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Se oculta tras 4 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#8b5e3c] text-white px-8 py-4 rounded-xl shadow-2xl z-50 text-base max-w-[90%] sm:max-w-md text-center"

      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
};
