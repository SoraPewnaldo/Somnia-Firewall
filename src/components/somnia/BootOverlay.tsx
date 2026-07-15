import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const LINES = [
  "SOMNIA//BOOT v4.2.19 :: initializing kernel…",
  "mount /dev/dreamscape … OK",
  "loading firewall shards [████████████████████] 100%",
  "handshake w/ NODE_01…NODE_16 … 14/16 responsive",
  "WARN: NODE_07 unresponsive",
  "WARN: NODE_12 unresponsive",
  "coolant loop pressure … NOMINAL",
  "cognitive dampener … ARMED",
  "operator ident: 899-K // graveyard shift",
  "▓ SESSION ESTABLISHED ▓",
];

export function BootOverlay({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (i >= LINES.length) {
      const t = setTimeout(() => {
        setGone(true);
        setTimeout(onDone, 400);
      }, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI((v) => v + 1), 180 + Math.random() * 180);
    return () => clearTimeout(t);
  }, [i, onDone]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="scanlines fixed inset-0 z-[100] bg-background flex items-center justify-center px-4"
        >
          <div className="w-full max-w-2xl">
            <div className="mb-6 flex items-center justify-between text-[10px] tracking-[0.3em] text-muted-foreground">
              <span>SOMNIA//TERMINAL</span>
              <span className="text-primary text-glow">SECURE_CHANNEL</span>
            </div>
            <pre className="font-mono text-xs sm:text-sm leading-6 text-cyan text-glow-soft whitespace-pre-wrap">
              {LINES.slice(0, i).map((l, k) => (
                <div key={k}>
                  <span className="text-muted-foreground">$&gt;</span> {l}
                </div>
              ))}
              {i < LINES.length && (
                <div className="text-primary">
                  <span className="text-muted-foreground">$&gt;</span> <span className="caret" />
                </div>
              )}
            </pre>
            <button
              onClick={() => {
                setGone(true);
                setTimeout(onDone, 200);
              }}
              className="mt-8 text-[10px] tracking-[0.3em] text-muted-foreground hover:text-primary"
            >
              [ESC] SKIP_BOOT_SEQUENCE
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
