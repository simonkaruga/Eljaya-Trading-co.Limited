'use client';

import { motion } from 'motion/react';
import { WhatsAppIcon } from './icons';

export function WhatsAppFloat({ number }: { number: string }) {
  return (
    <motion.a
      href={`https://wa.me/${number}?text=${encodeURIComponent('Hi Eljaya, I would like a quote for…')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.6, type: 'spring', stiffness: 260, damping: 18 }}
      className="group fixed bottom-5 right-5 z-40 hidden lg:flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.7)] transition-[padding] duration-500 hover:pr-5 lg:bottom-7 lg:right-7"
    >
      <WhatsAppIcon className="size-7" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500 group-hover:max-w-40 sm:block">
        Chat with us
      </span>
    </motion.a>
  );
}
