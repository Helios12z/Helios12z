import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Send, ChevronRight } from "lucide-react";
import { emitEvent } from "@/lib/socket";
import { playButtonClick, playWhoosh } from "@/lib/sounds";

interface Question {
  id: number;
  text: string;
  emoji: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Kỷ niệm đáng nhớ nhất của mình trong năm qua là gì?",
    emoji: "💝",
  },
  {
    id: 2,
    text: "Theo em những điểm em thích từ anh là gì? 😊",
    emoji: "⭐",
  },
  {
    id: 3,
    text: "Còn khuyết điểm nào của anh mà em muốn anh thay đổi? 🤔",
    emoji: "💪",
  },
  {
    id: 4,
    text: "Điều em muốn mình cùng nhau làm trong năm 2026?",
    emoji: "🌟",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeIn" as const,
    },
  }),
};

export default function QuestionsPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [direction, setDirection] = useState(1);
  const [isSending, setIsSending] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSubmit = () => {
    if (!answer.trim() || isSending) return;

    setIsSending(true);
    playButtonClick();

    // Haptic
    if (navigator.vibrate) navigator.vibrate(50);

    // Submit answer as GitHub Issue using environment variables
    const issueTitle = `Question ${currentQuestion.id} Answer`;
    const issueBody = `**Question:** ${currentQuestion.text}\n\n**Answer:** ${answer.trim()}\n\n**Timestamp:** ${new Date().toLocaleString('vi-VN')}`;

    // Get environment variables
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'Helios12z/Helios12z';

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: ['question-answer']
        })
      });

      if (response.status === 201) {
        console.log('✅ Answer submitted to GitHub successfully!');
      } else {
        console.log('⚠️ GitHub submission failed:', await response.text());
        // Log answer as fallback
        console.log('📝 Answer data:', {
          question: currentQuestion.text,
          answer: answer.trim(),
          timestamp: new Date().toLocaleString('vi-VN'),
          questionId: currentQuestion.id
        });
      }
    } catch (error) {
      console.error('❌ Error submitting to GitHub:', error);
      // Log answer as fallback
      console.log('📝 Answer data:', {
        question: currentQuestion.text,
        answer: answer.trim(),
        timestamp: new Date().toLocaleString('vi-VN'),
        questionId: currentQuestion.id
      });
    }

    setTimeout(() => {
      if (isLastQuestion) {
        router.push("/gallery");
      } else {
        playWhoosh();
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
        setAnswer("");
      }
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-deep-red opacity-60" />

      {/* Progress bar */}
      <div className="relative z-10 px-6 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-cream/40 text-xs font-sans font-medium">
            {currentIndex + 1}/{questions.length}
          </span>
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col justify-center relative z-10 px-6">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-8"
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="text-6xl text-center"
            >
              {currentQuestion.emoji}
            </motion.div>

            {/* Question text */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-serif text-2xl md:text-3xl text-cream text-center leading-relaxed"
            >
              {currentQuestion.text}
            </motion.h2>

            {/* Textarea */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Viết cho anh ở đây nha..."
                rows={4}
                className="
                  w-full p-5 rounded-2xl resize-none
                  glass-card text-cream text-base font-sans
                  placeholder:text-cream/25 placeholder:font-light
                  outline-none
                  focus:border-gold-400/30 focus:shadow-[0_0_30px_rgba(255,193,7,0.08)]
                  transition-all duration-300
                "
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit button */}
      <div className="relative z-10 px-6 pb-8">
        <AnimatePresence>
          {answer.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={handleSubmit}
                disabled={isSending}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="
                  w-full py-4 rounded-2xl font-sans font-semibold text-base
                  bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600
                  text-dark-600 shadow-lg shadow-gold-500/20
                  flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-shadow duration-300
                "
              >
                {isSending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                ) : isLastQuestion ? (
                  <>
                    Xem Kỷ Niệm
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Gửi & Tiếp tục
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
