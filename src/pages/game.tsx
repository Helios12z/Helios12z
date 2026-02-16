import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { emitEvent } from "@/lib/socket";
import { playBagShake, playBagOpen, playCelebration } from "@/lib/sounds";
import { Gift } from "lucide-react";

interface Bag {
  id: number;
  amount: string;
  message: string;
  emoji: string;
}

const bags: Bag[] = [
  { id: 1, amount: "Tai nghe Baseus + Son môi Maybelline", message: "Anh yêu em 💕", emoji: "🧧" },
  { id: 2, amount: "Tai nghe Baseus + Son môi Maybelline", message: "Luôn bên em mọi lúc �", emoji: "🧧" },
  { id: 3, amount: "Tai nghe Baseus + Son môi Maybelline", message: "Yêu em mỗi ngày 📅", emoji: "🧧" },
  { id: 4, amount: "Tai nghe Baseus + Son môi Maybelline", message: "Đôi ta mãi bên nhau 👫", emoji: "🧧" },
  { id: 5, amount: "Tai nghe Baseus + Son môi Maybelline", message: "Tình yêu lớn thêm mỗi ngày 📈", emoji: "🧧" },
  { id: 6, amount: "Tai nghe Baseus + Son môi Maybelline", message: "Thương cục cưng 🥰", emoji: "🧧" },
];

type BagState = "idle" | "shaking" | "revealed";

function CountUpNumber({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");
  const numericTarget = parseInt(target.replace(/,/g, ""));

  useEffect(() => {
    const duration = 2000;
    const steps = 40;
    const stepDuration = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(numericTarget * eased);
      setDisplay(current.toLocaleString("vi-VN"));

      if (step >= steps) {
        clearInterval(interval);
        setDisplay(target);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [target, numericTarget]);

  return <span>{display}</span>;
}

export default function GamePage() {
  const [selectedBag, setSelectedBag] = useState<number | null>(null);
  const [bagStates, setBagStates] = useState<Record<number, BagState>>(
    Object.fromEntries(bags.map((b) => [b.id, "idle" as BagState]))
  );
  const [revealedBag, setRevealedBag] = useState<Bag | null>(null);

  const handleSelectBag = useCallback(
    (bag: Bag) => {
      if (selectedBag !== null) return; // Already selected one
      setSelectedBag(bag.id);

      // Emit selection
      emitEvent("user_open_bag", {
        bagId: bag.id,
        amount: bag.amount,
        message: bag.message,
        timestamp: new Date().toISOString(),
      });

      // Haptic
      if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100]);

      // Start shaking with sound
      playBagShake();
      setBagStates((prev) => ({ ...prev, [bag.id]: "shaking" }));

      // Shake for 2 seconds then reveal
      setTimeout(() => {
        setBagStates((prev) => ({ ...prev, [bag.id]: "revealed" }));
        setRevealedBag(bag);
        playBagOpen();
        setTimeout(() => playCelebration(), 400);

        // Haptic on reveal
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        // Confetti explosion
        const burst = (opts: confetti.Options) =>
          confetti({
            ...opts,
            colors: ["#ffd700", "#ff69b4", "#c62828", "#ffb6c1", "#ff8f00"],
          });

        burst({ particleCount: 80, spread: 70, origin: { y: 0.5, x: 0.5 } });
        setTimeout(
          () => burst({ particleCount: 50, spread: 100, origin: { y: 0.4, x: 0.3 } }),
          200
        );
        setTimeout(
          () => burst({ particleCount: 50, spread: 100, origin: { y: 0.4, x: 0.7 } }),
          400
        );
        setTimeout(
          () => burst({ particleCount: 30, spread: 120, origin: { y: 0.6, x: 0.5 } }),
          600
        );
      }, 2000);
    },
    [selectedBag]
  );

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-deep-red" />

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="font-serif text-3xl font-bold text-cream text-shadow-glow mb-2">
            Lì Xì Năm Mới Nhé Eiuuu 🧧
          </h1>
          <p className="text-gold-300/60 text-sm font-light">
            Chọn một bao lì xì may mắn nha bé 💝
          </p>
        </motion.div>
      </div>

      {/* 3x2 Grid */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {bags.map((bag, i) => {
            const state = bagStates[bag.id];
            const isSelected = selectedBag === bag.id;
            const isDisabled = selectedBag !== null && !isSelected;

            return (
              <motion.button
                key={bag.id}
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{
                  opacity: isDisabled ? 0.3 : 1,
                  scale: state === "shaking" ? 1.15 : 1,
                  rotate: 0,
                }}
                transition={{
                  delay: i * 0.08 + 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                whileTap={
                  !isDisabled && state === "idle"
                    ? { scale: 0.9 }
                    : undefined
                }
                onClick={() => state === "idle" && !isDisabled && handleSelectBag(bag)}
                disabled={isDisabled}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center
                  transition-all duration-300 relative
                  ${state === "revealed"
                    ? "glass-card"
                    : isSelected
                      ? "glass-card animate-pulse-glow"
                      : "glass hover:bg-white/12"
                  }
                  ${isDisabled ? "pointer-events-none" : "cursor-pointer"}
                `}
              >
                {state === "revealed" ? (
                  // Revealed content
                  <motion.div
                    initial={{ scale: 0, rotateY: 90 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-center p-1"
                  >
                    <span className="text-xl">💰</span>
                  </motion.div>
                ) : state === "shaking" ? (
                  // Shaking envelope
                  <motion.div
                    animate={{
                      rotate: [0, -12, 12, -8, 8, -5, 5, -2, 2, 0],
                      x: [0, -4, 4, -3, 3, -2, 2, -1, 1, 0],
                      y: [0, -2, 2, -2, 2, -1, 1, 0, 0, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-5xl">{bag.emoji}</span>
                  </motion.div>
                ) : (
                  // Idle with float
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                      rotate: [0, 1, -1, 0],
                    }}
                    transition={{
                      duration: 3 + i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  >
                    <span className="text-5xl">{bag.emoji}</span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Reveal overlay */}
      <AnimatePresence>
        {revealedBag && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { }} // prevent close
          >
            <motion.div
              initial={{ scale: 0, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="glass-card p-8 mx-6 text-center max-w-sm"
            >
              {/* Gift icon */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-gold-400/20 flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-gold-400" />
                </div>
              </motion.div>

              {/* Amount */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                <p className="text-gold-300/60 text-sm font-sans mb-2">Bé nhận được</p>
                <h2 className="font-serif text-5xl font-bold text-gold-400 text-shadow-glow mb-1">
                  {revealedBag.amount}
                </h2>
              </motion.div>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-cream/80 text-lg font-serif mt-6 italic"
              >
                {revealedBag.message}
              </motion.p>

              {/* Love text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-cream/40 text-sm font-sans mt-8"
              >
                Yêu cục cưng nhiều lắm 💕
                <br />
                <span className="text-xs text-cream/20">— Minh Quang —</span>
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
