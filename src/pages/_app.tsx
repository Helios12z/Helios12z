import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import TetBackground from "@/components/TetBackground";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: "easeInOut" as const },
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [showMusicBtn, setShowMusicBtn] = useState(false);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    audioRef.current.onerror = () => {
      // Silently handle missing or empty music file
      audioRef.current = null;
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Start music on first user interaction
  const startMusic = useCallback(() => {
    if (!musicStarted && audioRef.current) {
      audioRef.current.play().then(() => {
        setMusicStarted(true);
        setShowMusicBtn(true);
      }).catch(() => {
        // Autoplay blocked — will retry on next interaction
      });
    }
  }, [musicStarted]);

  useEffect(() => {
    const handler = () => startMusic();
    document.addEventListener("click", handler, { once: false });
    document.addEventListener("touchstart", handler, { once: false });
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [startMusic]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Don't show music button on admin page
  const isAdmin = router.pathname === "/admin";

  return (
    <div className="noise-overlay gradient-romantic min-h-[100dvh] w-full overflow-hidden relative">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      {/* Animated Tet Background */}
      {!isAdmin && <TetBackground />}

      {/* Music Toggle */}
      {showMusicBtn && !isAdmin && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full glass flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-cream/70" />
          ) : (
            <Volume2 className="w-4 h-4 text-gold-400" />
          )}
        </motion.button>
      )}

      {/* Page Content */}
      <div className="max-w-md mx-auto min-h-[100dvh] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
            className="min-h-[100dvh]"
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
