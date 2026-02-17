import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { playPhotoSwipe } from "@/lib/sounds";

interface Photo {
  id: number;
  src: string;
  caption: string;
}

// Placeholder photos — replace with your real images in /public/photos/
const photos: Photo[] = [
  { id: 1, src: "/img/1.jpg", caption: "Tấm ảnh đầu tiên tụi mình chụp chung, cũng là tấm ảnh photobooth đầu tiên mà anh chụp" },
  { id: 2, src: "/img/2.jpg", caption: "Lần đầu anh đi hẹn hò xa vậy, lần đầu đi triễn lãm với người mình yêu" },
  { id: 3, src: "/img/3.jpg", caption: "Phá đảo Photobooth với eiuu, eiuu siuuu xinh" },
  { id: 4, src: "/img/4.jpg", caption: "Study date lần đầu của anh với người anh thật sự yêu, cảm ơn em đã ở bên anh nhoaa" },
  { id: 5, src: "/img/5.jpg", caption: "Lần đầu anh đi chơi xa, lần đầu anh được đi Vũng Tàu với người con gái anh thương nhất" },
  { id: 6, src: "/img/6.jpg", caption: "Vũng Tàu đẹp, nhưng còn đẹp hơn nhiềuu khi có em bên cạnh" },
  { id: 7, src: "/img/7.jpg", caption: "Phá đảo Photobooth ở Vũng Tàu, siuu thích tấm này hihi, nàng thơ của tuii" },
  { id: 8, src: "/img/8.jpg", caption: "Tấm ảnh cuối mình chụp chung của năm 2025, sang năm mới mình cùng chụp nhiềuu hơn nữa nhaa" },
];

const DURATION = 10000; // 10 seconds per photo
const TICK = 50; // Update progress every 50ms

export default function GalleryPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressRef = useRef(false);

  const currentPhoto = photos[currentIndex];

  // Auto-advance timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK / DURATION) * 100;
        if (next >= 100) {
          // Go to next or finish
          setDirection(1);
          setCurrentIndex((prevIndex) => {
            if (prevIndex >= photos.length - 1) {
              // Delay before navigating so the last photo is fully visible
              if (timerRef.current) clearInterval(timerRef.current);
              setTimeout(() => router.push("/letter"), 2000);
              return prevIndex;
            }
            return prevIndex + 1;
          });
          return 0;
        }
        return next;
      });
    }, TICK);
  }, [router]);

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex, startTimer]);

  const goTo = (index: number) => {
    if (index < 0 || index >= photos.length) {
      if (index >= photos.length) router.push("/letter");
      return;
    }
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
    playPhotoSwipe();
    if (navigator.vibrate) navigator.vibrate(20);
  };

  // Touch handlers for tap left/right and long press
  const handleTouchStart = () => {
    longPressRef.current = false;
    const timeout = setTimeout(() => {
      longPressRef.current = true;
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }, 300);
    // Store timeout to clear on touch end
    (window as unknown as Record<string, unknown>).__lpTimeout = timeout;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    clearTimeout((window as unknown as Record<string, unknown>).__lpTimeout as number);

    if (longPressRef.current) {
      setIsPaused(false);
      return;
    }

    // Determine tap position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.changedTouches[0]?.clientX ?? 0;
    const relX = (x - rect.left) / rect.width;

    if (relX < 0.3) {
      goTo(currentIndex - 1);
    } else {
      goTo(currentIndex + 1);
    }
  };

  // Mouse handlers for desktop testing
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    if (relX < 0.3) {
      goTo(currentIndex - 1);
    } else {
      goTo(currentIndex + 1);
    }
  };

  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-black">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-3">
        {photos.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{
                width:
                  i < currentIndex
                    ? "100%"
                    : i === currentIndex
                      ? `${progress}%`
                      : "0%",
              }}
              transition={{ duration: 0.05, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      {/* Photo */}
      <div
        className="absolute inset-0 cursor-pointer select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {/* Ken Burns zoom */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: DURATION / 1000, ease: "linear" }}
              className="absolute inset-0"
            >
              <img
                src={currentPhoto.src}
                alt={currentPhoto.caption}
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
            </motion.div>

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="font-serif text-xl text-cream text-shadow-soft leading-relaxed"
          >
            {currentPhoto.caption}
          </motion.p>
        </AnimatePresence>

        {/* Photo counter */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-cream/40 text-xs font-sans mt-3"
        >
          {currentIndex + 1} / {photos.length}
        </motion.p>
      </div>

      {/* Pause indicator */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
              <div className="flex gap-1.5">
                <div className="w-2 h-6 bg-cream/80 rounded-full" />
                <div className="w-2 h-6 bg-cream/80 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
