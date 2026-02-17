import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, collection, getDocs, query, orderBy, limit } from "@/lib/firebase";
import { Heart } from "lucide-react";

interface Answer {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  questionId: number;
  questionNumber: number;
}

export default function AdminAnswersPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      if (db) {
        const answersQuery = query(
          collection(db, "answers"),
          orderBy("timestamp", "desc"),
          limit(50)
        );

        const querySnapshot = await getDocs(answersQuery);
        const fetchedAnswers: Answer[] = [];

        querySnapshot.forEach((doc) => {
          fetchedAnswers.push({ id: doc.id, ...doc.data() } as Answer);
        });

        setAnswers(fetchedAnswers);
      } else {
        setError("Firebase not initialized. Answers cannot be loaded.");
      }
    } catch (err) {
      console.error("Error fetching answers:", err);
      setError("Failed to load answers. Check your Firebase configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-pink-200 text-lg">
            View all the answers from your quiz
          </p>
          <div className="flex justify-center mt-4">
            <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          {loading ? (
            <div className="text-center text-white">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-2">Loading answers...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
              {error}
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-green-200">
              ✅ Successfully loaded {answers.length} answer(s)
            </div>
          )}
        </motion.div>

        {/* Answers List */}
        <div className="space-y-4">
          <AnimatePresence>
            {answers.map((answer, index) => (
              <motion.div
                key={answer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-white mb-2">
                      Question {answer.questionNumber}
                    </h3>
                    <p className="text-pink-200 text-sm mb-3">
                      {answer.question}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-white/60 block">
                      {new Date(answer.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-white/90 leading-relaxed">
                    {answer.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {answers.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-white/60"
            >
              <p>No answers yet. Be patient, love is coming! 💕</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-white/50 text-sm"
        >
          <p>Answers are automatically saved to Firebase Firestore</p>
          <p className="mt-2">Refresh this page to see new answers</p>
        </motion.div>
      </div>
    </div>
  );
}