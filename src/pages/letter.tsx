import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";
import { playButtonClick } from "@/lib/sounds";

// Floating petal inside the card
function CardPetals() {
  const petals = [
    { id: 0, x: 5, delay: 0, dur: 8, size: 14 },
    { id: 1, x: 85, delay: 2, dur: 10, size: 12 },
    { id: 2, x: 45, delay: 4, dur: 9, size: 10 },
    { id: 3, x: 70, delay: 1, dur: 11, size: 16 },
    { id: 4, x: 25, delay: 3, dur: 7, size: 11 },
    { id: 5, x: 90, delay: 5, dur: 9, size: 13 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-3xl">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute opacity-20"
          style={{ left: `${p.x}%`, top: "-8%", fontSize: p.size }}
          animate={{
            y: ["0%", "1200%"],
            x: [0, 20, -15, 10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            y: { duration: p.dur, repeat: Infinity, ease: "linear", delay: p.delay },
            x: { duration: p.dur * 0.6, repeat: Infinity, ease: "easeInOut", delay: p.delay },
            rotate: { duration: p.dur, repeat: Infinity, ease: "linear", delay: p.delay },
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}

// Ornamental divider
function OrnamentalDivider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className="flex items-center justify-center gap-3 my-6"
    >
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-400/40" />
      <motion.span
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-lg"
      >
        🏮
      </motion.span>
      <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-400/40" />
    </motion.div>
  );
}

// Letter paragraph with stagger
function LetterParagraph({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="font-serif text-cream/85 text-base leading-[1.9] tracking-wide"
    >
      {children}
    </motion.p>
  );
}

export default function LetterPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 gradient-deep-red opacity-40" />

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-8" style={{ WebkitOverflowScrolling: "touch" }}>
        {/* Envelope icon with bounce */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="text-center mb-4"
        >
          <motion.span
            className="inline-block text-6xl"
            animate={{
              y: [0, -8, 0],
              filter: [
                "drop-shadow(0 0 10px rgba(255,193,7,0))",
                "drop-shadow(0 0 20px rgba(255,193,7,0.4))",
                "drop-shadow(0 0 10px rgba(255,193,7,0))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            💌
          </motion.span>
        </motion.div>

        {/* Title with glow */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="font-serif text-3xl font-bold text-cream text-center mb-1"
          style={{
            textShadow: "0 0 30px rgba(255,193,7,0.3), 0 0 60px rgba(255,193,7,0.1)",
          }}
        >
          Gửi Em Yêu
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-gold-300/50 text-xs text-center mb-4 font-light tracking-[0.3em] uppercase"
        >
          Tết Nguyên Đán 2026
        </motion.p>

        {/* ====== THE CARD ====== */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden mb-8"
        >
          {/* Card background with pattern */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, rgba(139,0,0,0.25) 0%, rgba(10,4,8,0.6) 50%, rgba(139,0,0,0.2) 100%)
              `,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          />

          {/* Oriental pattern overlay — corner decorations */}
          <div className="absolute inset-0 pointer-events-none z-[1]">
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 w-20 h-20 opacity-15">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-400">
                <path d="M0 0 Q50 0 50 50 Q50 0 100 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M0 0 Q0 50 50 50 Q0 50 0 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
                <path d="M10 10 Q30 10 30 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                <path d="M15 5 Q25 5 25 15" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
              </svg>
            </div>
            {/* Top-right corner */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-15 scale-x-[-1]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-400">
                <path d="M0 0 Q50 0 50 50 Q50 0 100 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M0 0 Q0 50 50 50 Q0 50 0 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
                <path d="M10 10 Q30 10 30 30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              </svg>
            </div>
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 w-20 h-20 opacity-15 scale-y-[-1]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-400">
                <path d="M0 0 Q50 0 50 50 Q50 0 100 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M0 0 Q0 50 50 50 Q0 50 0 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
              </svg>
            </div>
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-15 scale-[-1]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-400">
                <path d="M0 0 Q50 0 50 50 Q50 0 100 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M0 0 Q0 50 50 50 Q0 50 0 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
              </svg>
            </div>

            {/* Top border decoration */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="absolute top-3 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
            />
            {/* Bottom border decoration */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="absolute bottom-3 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
            />
            {/* Left border */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute top-8 bottom-8 left-3 w-[1px] bg-gradient-to-b from-transparent via-gold-400/20 to-transparent"
            />
            {/* Right border */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute top-8 bottom-8 right-3 w-[1px] bg-gradient-to-b from-transparent via-gold-400/20 to-transparent"
            />
          </div>

          {/* Floating petals inside card */}
          {mounted && <CardPetals />}

          {/* Inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, rgba(255,193,7,0.06) 0%, transparent 60%)`,
            }}
          />

          {/* Card content */}
          <div className="relative z-10 px-7 py-8 space-y-1">
            {/* Opening */}
            <LetterParagraph delay={1.2}>
              Em yêu à,
            </LetterParagraph>

            <OrnamentalDivider delay={1.4} />

            <LetterParagraph delay={1.6}>
              Từ lúc yêu em tới giờ, anh vẫn không ngừng biết ơn vì có em
              bên cạnh. Từ cái ngày mình quen nhau, mỗi khoảnh khắc bên em đều
              là những trang đẹp nhất trong cuốn sách cuộc đời anh. ✨
            </LetterParagraph>

            <LetterParagraph delay={1.9}>
              Có những ngày mình cười thật nhiều, có những lúc mình giận hờn nhau
              — nhưng tất cả đều là gia vị làm tình yêu mình thêm đậm đà. Anh
              yêu từng nụ cười, từng cái nhăn mặt, từng dòng tin nhắn
              mà em gửi cho anh. 💕
            </LetterParagraph>

            <OrnamentalDivider delay={2.2} />

            <LetterParagraph delay={2.4}>
              Bước vào năm 2026, anh chỉ có một điều ước — đó là được tiếp tục
              nắm tay em đi qua mọi mùa xuân, mọi mùa hạ, mọi ngày nắng cũng
              như mưa, được chăm sóc, được lo lắng và được làm em hạnh phúc mỗi ngày. 🌸
            </LetterParagraph>

            <LetterParagraph delay={2.7}>
              Chúc em yêu năm mới thật nhiều sức khỏe, thật nhiều niềm vui, và
              luôn xinh đẹp rạng ngời như bây giờ. Anh hứa sẽ cố gắng trở thành
              phiên bản tốt hơn mỗi ngày — xứng đáng hơn với tình yêu mà em
              dành cho anh. Hứa sẽ mãi bên cạnh em và không bao giờ rời xa em. 🌹
            </LetterParagraph>

            <LetterParagraph delay={3.0}>
              Cảm ơn em đã luôn ở bên anh. Cảm ơn em đã chọn anh.
            </LetterParagraph>

            <OrnamentalDivider delay={3.2} />

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3.4, duration: 0.6 }}
              className="pt-2 text-right"
            >
              <p className="font-serif text-gold-300/70 text-base italic">
                Yêu em nhiều lắm,
              </p>
              <motion.p
                className="font-serif text-gold-300 text-xl font-semibold mt-2"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255,193,7,0)",
                    "0 0 20px rgba(255,193,7,0.3)",
                    "0 0 10px rgba(255,193,7,0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Anh yêu của em 💝
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative elements below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          {["🌸", "🏮", "🧧", "🏮", "🌸"].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-xl"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Continue button */}
      <div className="relative z-10 px-6 pb-8">
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                onClick={() => {
                  playButtonClick();
                  router.push("/game");
                }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="
                  w-full py-4 rounded-2xl font-sans font-semibold text-base
                  bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600
                  text-dark-600 shadow-lg shadow-gold-500/20
                  flex items-center justify-center gap-2
                  transition-shadow duration-300
                "
                style={{
                  boxShadow: "0 4px 30px rgba(255,193,7,0.2), 0 0 60px rgba(255,193,7,0.1)",
                }}
              >
                Nhận Lì Xì Nà Cục Cưng 🧧
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
