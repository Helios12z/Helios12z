import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface LogEntry {
  id: number;
  time: string;
  type: "login" | "answer" | "photo" | "bag" | "system";
  message: string;
}

function getTimeString(): string {
  return new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const typeColors: Record<LogEntry["type"], string> = {
  login: "text-green-400",
  answer: "text-yellow-300",
  photo: "text-cyan-400",
  bag: "text-pink-400",
  system: "text-gray-500",
};

const typeLabels: Record<LogEntry["type"], string> = {
  login: "LOGIN",
  answer: "ANSWER",
  photo: "PHOTO",
  bag: "BAG",
  system: "SYS",
};

export default function AdminPage() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 0,
      time: getTimeString(),
      type: "system",
      message: "Admin console initialized. Using Firebase for data collection.",
    },
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(1);

  const addLog = (type: LogEntry["type"], message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: idCounter.current++,
        time: getTimeString(),
        type,
        message,
      },
    ]);
  };

  // Auto-scroll
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="min-h-[100dvh] bg-black text-green-400 font-mono p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-4 border-b border-green-900/50 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-500 text-xs font-bold tracking-widest uppercase">
            ADMIN CONSOLE
          </span>
        </div>
        <p className="text-green-700 text-xs">
          Lì Xì Tình Yêu 2026 — Live Monitor v1.0
        </p>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto space-y-1 text-sm" style={{ scrollbarWidth: 'none' }}>
        {logs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i === logs.length - 1 ? 0 : 0 }}
            className="flex gap-2 items-start"
          >
            <span className="text-green-700 shrink-0">[{log.time}]</span>
            <span
              className={`shrink-0 font-bold ${typeColors[log.type]}`}
            >
              [{typeLabels[log.type]}]
            </span>
            <span className="text-green-300/90 break-all">{log.message}</span>
          </motion.div>
        ))}
        <div ref={logEndRef} />

        {/* Terminal cursor */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-green-500">$</span>
          <span className="terminal-cursor text-green-500 text-sm" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-green-900/50">
        <div className="flex justify-between text-xs text-green-800">
          <span>Events: {logs.length}</span>
          <span>Socket: {typeof window !== "undefined" ? "active" : "—"}</span>
        </div>
      </div>
    </div>
  );
}
