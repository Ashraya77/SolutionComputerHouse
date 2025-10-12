"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const images = ["/banner.jpg", "/banner1.jpg", "/banner2.webp"];
export default function MotionBanner() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto slide every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [index]);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[40vh] overflow-hidden select-none">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          src={images[index]}
          alt={`Slide ${index + 1}`}
          className="absolute w-full h-full object-cover"
          custom={direction}
          initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x * velocity.x;
            if (swipe < -10000) nextSlide();
            if (swipe > 10000) prevSlide();
          }}
        />
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60 transition"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60 transition"
      >
        ▶
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
