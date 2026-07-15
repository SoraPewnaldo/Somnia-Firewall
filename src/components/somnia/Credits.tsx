export function Credits() {
  return (
    <footer className="scanlines border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="flex flex-col gap-4 text-[10px] tracking-[0.3em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>STELLAR_HACK // ROUND_1 // SUBMISSION</span>
          <span className="text-primary text-glow">THEME :: REALITY REIMAGINED</span>
        </div>
        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="font-display text-6xl text-foreground text-glow sm:text-8xl">
              TEAM <span className="text-primary">TOODLES</span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Aakhya Chhauhan &nbsp;//&nbsp; Ayush Dakwal
            </div>
          </div>
          <div className="bevel-frame corner-ticks relative p-4 text-[11px] tracking-[0.25em]">
            <div className="text-muted-foreground">TRANSMISSION_END</div>
            <div className="mt-2 text-cyan">DO NOT DISCUSS THE FIREWALL</div>
            <div className="text-cyan">DO NOT LOOK AT THE LEAKS DIRECTLY</div>
            <div className="text-alert text-glow">DO NOT SLEEP ON SHIFT</div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between text-[10px] tracking-[0.3em] text-muted-foreground">
          <span>© SOMNIUM_INC. // ALL DREAMS RESERVED</span>
          <span className="blink text-primary">▮</span>
        </div>
      </div>
    </footer>
  );
}
