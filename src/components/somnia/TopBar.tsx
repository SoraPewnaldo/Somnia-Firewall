import { useEffect, useState } from "react";

export function useCountdown(startSeconds: number) {
  const [s, setS] = useState(startSeconds);
  useEffect(() => {
    const t = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return { mm, ss, seconds: s };
}

export function TopBar({ mm, ss }: { mm: string; ss: string }) {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3 text-[10px] tracking-[0.25em]">
        <div className="flex items-center gap-3">
          <span className="text-foreground font-display">SOMNIA</span>
          <span className="hidden text-muted-foreground sm:inline">// TERMINAL v4.2</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">SECTOR <span className="text-cyan">N-AM/04</span></span>
          <span className="text-muted-foreground">T-MINUS</span>
          <span className="font-display text-lg leading-none text-primary tabular-nums">
            {mm}:{ss}
          </span>
        </div>
      </div>
    </div>
  );
}
