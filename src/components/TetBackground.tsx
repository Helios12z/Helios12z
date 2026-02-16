import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// ===== FIREWORK BURST =====
interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  delay: number;
}

function FireworkBurst({ x, y, color }: { x: number; y: number; color: string }) {
  const [sparks] = useState<Spark[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x,
      y,
      color,
      size: (i * 1.3 + 2) % 4 + 2,
      angle: (360 / 12) * i + (i * 3.7) % 15,
      distance: (i * 7.3 + 40) % 60 + 40,
      delay: (i * 0.013) % 0.1,
    }))
  );

  return (
    <>
      {sparks.map((spark) => {
        const rad = (spark.angle * Math.PI) / 180;
        const endX = Math.cos(rad) * spark.distance;
        const endY = Math.sin(rad) * spark.distance;
        return (
          <motion.div
            key={`${x}-${y}-${spark.id}`}
            className="absolute rounded-full"
            style={{
              left: `${spark.x}%`,
              top: `${spark.y}%`,
              width: spark.size,
              height: spark.size,
              background: spark.color,
              boxShadow: `0 0 6px ${spark.color}, 0 0 12px ${spark.color}`,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: [1, 1, 0],
              x: endX,
              y: endY,
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 1.2,
              delay: spark.delay,
              ease: "easeOut",
            }}
          />
        );
      })}
    </>
  );
}

// ===== FIREWORKS LAYER =====
function Fireworks() {
  const [bursts, setBursts] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);

  useEffect(() => {
    const colors = ["#ffd700", "#ff69b4", "#ff4444", "#ffaa00", "#ff6b6b", "#ffc107"];
    let id = 0;

    const launchFirework = () => {
      const newBurst = {
        id: id++,
        x: Math.random() * 80 + 10,
        y: Math.random() * 40 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setBursts((prev) => [...prev.slice(-6), newBurst]);
    };

    setTimeout(launchFirework, 500);
    setTimeout(launchFirework, 1200);

    const interval = setInterval(() => {
      launchFirework();
      if (Math.random() > 0.5) {
        setTimeout(launchFirework, 300);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {bursts.map((burst) => (
        <FireworkBurst key={burst.id} x={burst.x} y={burst.y} color={burst.color} />
      ))}
    </div>
  );
}

// ===== FLOATING LANTERNS =====
function FloatingLanterns() {
  const lanterns = [
    { id: 1, x: 8, size: 28, delay: 0, duration: 7 },
    { id: 2, x: 85, size: 22, delay: 2, duration: 8 },
    { id: 3, x: 45, size: 18, delay: 4, duration: 9 },
    { id: 4, x: 70, size: 24, delay: 1, duration: 7.5 },
    { id: 5, x: 25, size: 20, delay: 3, duration: 8.5 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {lanterns.map((l) => (
        <motion.div
          key={l.id}
          className="absolute"
          style={{
            left: `${l.x}%`,
            top: "-5%",
            fontSize: l.size,
            filter: "drop-shadow(0 0 8px rgba(255,100,0,0.4))",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(l.id) * 30, 0, Math.sin(l.id + 1) * -20, 0],
            rotate: [0, 5, -5, 3, 0],
          }}
          transition={{
            y: { duration: l.duration * 3, repeat: Infinity, ease: "linear", delay: l.delay },
            x: { duration: l.duration, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: l.duration * 0.8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          🏮
        </motion.div>
      ))}
    </div>
  );
}

// ===== CHERRY BLOSSOM PETALS (pre-computed, no Math.random) =====
const PETALS = [
  { id: 0, x: 5, size: 12, delay: 0, duration: 10, opacity: 0.25 },
  { id: 1, x: 15, size: 16, delay: 1.5, duration: 12, opacity: 0.3 },
  { id: 2, x: 28, size: 10, delay: 3, duration: 9, opacity: 0.2 },
  { id: 3, x: 38, size: 14, delay: 0.5, duration: 11, opacity: 0.35 },
  { id: 4, x: 48, size: 11, delay: 4, duration: 13, opacity: 0.22 },
  { id: 5, x: 58, size: 15, delay: 2, duration: 10, opacity: 0.28 },
  { id: 6, x: 68, size: 9, delay: 5, duration: 12, opacity: 0.18 },
  { id: 7, x: 75, size: 13, delay: 1, duration: 9, opacity: 0.32 },
  { id: 8, x: 82, size: 17, delay: 6, duration: 14, opacity: 0.2 },
  { id: 9, x: 90, size: 11, delay: 3.5, duration: 11, opacity: 0.26 },
  { id: 10, x: 42, size: 14, delay: 7, duration: 10, opacity: 0.3 },
  { id: 11, x: 62, size: 10, delay: 2.5, duration: 12, opacity: 0.22 },
];

function CherryBlossoms() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {PETALS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            fontSize: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, 40, -30, 20, 0],
            rotate: [0, 180, 360, 540, 720],
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
            x: { duration: p.duration * 0.7, repeat: Infinity, ease: "easeInOut", delay: p.delay },
            rotate: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}

// ===== FLOATING TET ICONS =====
function FloatingTetIcons() {
  const icons = [
    { id: 1, emoji: "🧨", x: 15, size: 20, delay: 1, duration: 10 },
    { id: 2, emoji: "🎊", x: 75, size: 18, delay: 3, duration: 12 },
    { id: 3, emoji: "🐉", x: 50, size: 22, delay: 5, duration: 11 },
    { id: 4, emoji: "🎋", x: 90, size: 16, delay: 2, duration: 9 },
    { id: 5, emoji: "🧧", x: 35, size: 18, delay: 6, duration: 10 },
    { id: 6, emoji: "🎆", x: 60, size: 20, delay: 0, duration: 11 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute"
          style={{
            left: `${icon.x}%`,
            bottom: "-5%",
            fontSize: icon.size,
            opacity: 0.25,
          }}
          animate={{
            y: [0, "-110vh"],
            x: [0, Math.sin(icon.id * 2) * 25, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0, 0.3, 0.25, 0],
          }}
          transition={{
            y: { duration: icon.duration, repeat: Infinity, ease: "linear", delay: icon.delay },
            x: { duration: icon.duration * 0.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: icon.duration * 0.4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: icon.duration, repeat: Infinity, ease: "easeInOut", delay: icon.delay },
          }}
        />
      ))}
    </div>
  );
}

// ===== MAIN BACKGROUND EXPORT =====
export default function TetBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/background/background TET.png')` }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/0" />

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse at 50% 20%, rgba(139,0,0,0.3) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(10,4,8,0.3) 0%, rgba(10,4,8,0.5) 100%)
          `,
        }}
      />

      {/* Animated elements — client only */}
      {mounted && (
        <>
          <Fireworks />
          <FloatingLanterns />
          <CherryBlossoms />
          <FloatingTetIcons />
        </>
      )}
    </div>
  );
}

