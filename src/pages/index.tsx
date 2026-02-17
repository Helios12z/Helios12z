import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Heart, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { playLoginSuccess, playButtonClick, playError } from "@/lib/sounds";

// Bokeh particle component (pre-computed values to avoid hydration mismatch)
const BOKEH_DATA = [
  { id: 0, size: 45, x: 10, y: 15, delay: 0, duration: 7, opacity: 0.08 },
  { id: 1, size: 65, x: 85, y: 25, delay: 1.5, duration: 9, opacity: 0.12 },
  { id: 2, size: 30, x: 40, y: 70, delay: 0.5, duration: 6, opacity: 0.06 },
  { id: 3, size: 50, x: 70, y: 45, delay: 3, duration: 8, opacity: 0.1 },
  { id: 4, size: 35, x: 20, y: 80, delay: 2, duration: 7, opacity: 0.07 },
  { id: 5, size: 55, x: 55, y: 10, delay: 4, duration: 9, opacity: 0.15 },
  { id: 6, size: 40, x: 30, y: 55, delay: 1, duration: 6.5, opacity: 0.09 },
  { id: 7, size: 70, x: 90, y: 65, delay: 2.5, duration: 8, opacity: 0.11 },
  { id: 8, size: 25, x: 60, y: 35, delay: 3.5, duration: 7, opacity: 0.05 },
  { id: 9, size: 48, x: 15, y: 50, delay: 0.8, duration: 8.5, opacity: 0.13 },
  { id: 10, size: 38, x: 75, y: 85, delay: 4.5, duration: 6, opacity: 0.08 },
  { id: 11, size: 58, x: 45, y: 20, delay: 1.2, duration: 9, opacity: 0.14 },
  { id: 12, size: 32, x: 5, y: 40, delay: 2.8, duration: 7.5, opacity: 0.06 },
  { id: 13, size: 52, x: 65, y: 90, delay: 3.2, duration: 8, opacity: 0.1 },
  { id: 14, size: 42, x: 50, y: 60, delay: 0.3, duration: 7, opacity: 0.09 },
];

function BokehParticles() {

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BOKEH_DATA.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, ${p.id % 3 === 0
              ? "rgba(255,193,7,0.3)"
              : p.id % 3 === 1
                ? "rgba(255,105,180,0.25)"
                : "rgba(198,40,40,0.2)"
              } 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -30, -15, -40, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [p.opacity, p.opacity * 2, p.opacity * 1.5, p.opacity * 2.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

const CORRECT_PASSWORD = "04122025";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show input after initial animation
  useEffect(() => {
    const timer = setTimeout(() => setShowInput(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    playButtonClick();

    if (password === CORRECT_PASSWORD) {
      setIsUnlocking(true);
      playLoginSuccess();
      console.log('🎉 User logged in at:', new Date().toISOString());

      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

      // Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#ffd700", "#ff69b4", "#c62828", "#ffb6c1"],
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { y: 0.4, x: 0.3 },
          colors: ["#ffd700", "#ff69b4"],
        });
      }, 300);

      // Navigate after animation
      setTimeout(() => router.push("/questions"), 1800);
    } else {
      setError(true);
      playError();
      setPassword("");
      if (navigator.vibrate) navigator.vibrate(300);
      setTimeout(() => setError(false), 600);
    }
  };

  const handlePinChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setPassword(digits);

    // Auto-submit when 8 digits entered
    if (digits.length === 8) {
      setTimeout(() => {
        playButtonClick();
        if (digits === CORRECT_PASSWORD) {
          setIsUnlocking(true);
          playLoginSuccess();
          console.log('🎉 User logged in at:', new Date().toISOString());
          if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ["#ffd700", "#ff69b4", "#c62828", "#ffb6c1"],
          });
          setTimeout(() => router.push("/questions"), 1800);
        } else {
          setError(true);
          playError();
          setPassword("");
          if (navigator.vibrate) navigator.vibrate(300);
          setTimeout(() => setError(false), 600);
        }
      }, 200);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Deep red gradient background */}
      <div className="absolute inset-0 gradient-deep-red" />

      {/* Bokeh particles */}
      <BokehParticles />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isUnlocking ? 0 : 1, y: isUnlocking ? -20 : 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1 className="font-serif text-4xl font-bold text-cream mb-2 text-shadow-glow">
            Chúc Mừng Năm Mới
          </h1>
          <p className="text-gold-300/80 text-sm font-light tracking-widest uppercase">
            Vợ Yêu Thùy Trâm💕
          </p>
        </motion.div>

        {/* Input area */}
        <AnimatePresence>
          {showInput && !isUnlocking && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full space-y-5"
            >
              {/* Lock icon */}
              <div className="flex justify-center mb-1">
                <Lock className="w-5 h-5 text-cream/30" />
              </div>

              {/* PIN boxes */}
              <div
                className="flex justify-center gap-2 cursor-pointer"
                onClick={() => inputRef.current?.focus()}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                    className={`
                      w-9 h-12 rounded-xl flex items-center justify-center
                      border transition-all duration-200
                      ${error
                        ? "border-red-500/80 animate-shake bg-red-500/5"
                        : i < password.length
                          ? "border-gold-400/50 bg-gold-400/10 shadow-[0_0_15px_rgba(255,193,7,0.1)]"
                          : i === password.length
                            ? "border-gold-400/30 bg-white/8"
                            : "border-white/10 bg-white/5"
                      }
                    `}
                  >
                    {i < password.length ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 rounded-full bg-gold-400"
                      />
                    ) : null}
                  </motion.div>
                ))}

                {/* Hidden input */}
                <input
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={password}
                  onChange={(e) => handlePinChange(e.target.value)}
                  className="absolute opacity-0 w-0 h-0"
                  autoComplete="off"
                  autoFocus
                  maxLength={8}
                />
              </div>

              {/* Hint */}
              <p className="text-cream/30 text-xs text-center font-light italic">
                Gợi ý: ngày hai ta chính thức thành đôi 💑
              </p>

              {/* Submit button — show when all 8 digits entered */}
              <AnimatePresence>
                {password.length === 8 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      onClick={handleSubmit}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="
                        w-full py-4 rounded-2xl font-sans font-semibold text-base
                        bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600
                        text-dark-600 shadow-lg shadow-gold-500/20
                        active:shadow-gold-500/30
                        transition-shadow duration-300
                      "
                    >
                      ✨ Mở Quà ✨
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error hint */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-velvet-300 text-xs text-center font-light"
                  >
                    Sai rồi eiuu ơi, thử lại nha~ 💕
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
