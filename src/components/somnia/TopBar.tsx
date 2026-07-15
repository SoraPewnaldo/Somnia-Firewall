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
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-GB", { hour12: false }) + " UTC",
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="scanlines sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-2 text-[10px] tracking-[0.3em]">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-primary pulse-alert" />
          <span className="text-foreground text-glow-soft">SOMNIA_FIREWALL</span>
          <span className="hidden text-muted-foreground sm:inline">// TERMINAL v4.2</span>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <span className="text-muted-foreground">TECH_ID <span className="text-cyan">899-K</span></span>
          <span className="text-muted-foreground">SECTOR <span className="text-cyan">N-AM/04</span></span>
          <span className="text-muted-foreground">{now}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">T-MINUS</span>
          <span className="font-display text-lg leading-none text-primary text-glow tabular-nums">
            {mm}:{ss}
          </span>
        </div>
      </div>
      <MarqueeBar />
    </div>
  );
}

function MarqueeBar() {
  const items = [
    "CLASS-4 LEAK // SECTOR 4 // FINANCIAL DISTRICT",
    "AUTOMATED DAMPENERS OFFLINE",
    "NODE 07 UNRESPONSIVE",
    "NODE 12 UNRESPONSIVE",
    "GLOBAL PANIC INDEX 88%",
    "REALITY DRIFT DETECTED :: 4TH AVE",
    "COOLANT RESERVE 61%",
    "OVERRIDES REMAINING :: 3",
  ];
  const line = items.join("   ◆   ") + "   ◆   ";
  return (
    <div className="overflow-hidden border-t border-border bg-alert/10 text-alert">
      <div className="marquee-track flex whitespace-nowrap py-1 text-[10px] tracking-[0.25em] text-glow-soft">
        <span className="px-4">{line}</span>
        <span className="px-4">{line}</span>
      </div>
    </div>
  );
}
