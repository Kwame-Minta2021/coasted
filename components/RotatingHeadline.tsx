"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type RotatingHeadlineProps = {
  messages: string[];
  intervalMs?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  subtitle?: string;
};

export default function RotatingHeadline({
  messages,
  intervalMs = 2400,
  className = "",
  as: Component = "h1",
  subtitle,
}: RotatingHeadlineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [messages.length, intervalMs, isHovered]);

  const currentMessage = messages[currentIndex];
  const words = currentMessage.split(" ");

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {words.map((word, wordIndex) => (
            <motion.span
              key={`${currentIndex}-${wordIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: wordIndex * 0.1,
                ease: "easeOut",
              }}
              className="inline-block mr-4"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
