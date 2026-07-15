import { motion } from "motion/react";
import Shuffle from "@/components/reactbits/Shuffle";
import SpecularButton from "@/components/reactbits/SpecularButton";


export function Hero() {
  return (
    <section className="scanlines relative overflow-hidden border-b border-border">
      {/* backdrop grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.72 0.32 340 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.11 210 / 0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 40%, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="flex flex-col gap-4 text-[10px] tracking-[0.3em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>FILE_REF // UNIVERSE_CARD // 01</span>
          <span className="text-alert text-glow">SYS_MSG :: THE FIREWALL IS HOLDING. BARELY.</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 font-display leading-[0.85] tracking-tight text-foreground text-glow"
        >
          <Shuffle
            tag="h1"
            text="PROJECT"
            textAlign="left"
            shuffleDirection="right"
            duration={0.4}
            stagger={0.04}
            scrambleCharset="!@#$%&*<>/\\?01"
            triggerOnHover
            className="block text-[16vw] sm:text-[11rem]"
          />
          <Shuffle
            tag="h1"
            text="SOMNIA"
            textAlign="left"
            shuffleDirection="left"
            duration={0.45}
            stagger={0.05}
            scrambleCharset="!@#$%&*<>/\\?01"
            triggerOnHover
            className="block text-[16vw] sm:text-[11rem] text-primary"
          />
        </motion.div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Meta label="CLASSIFICATION" value="REALITY REIMAGINED" />
          <Meta label="GENRE" value="SCI-FI / DREAMCORE THRILLER" />
          <Meta label="OPERATOR" value="L3 SYNC TECH // NIGHT SHIFT" />
        </div>

        <div className="mt-14 max-w-3xl">
          <p className="text-lg leading-relaxed text-foreground/90 sm:text-2xl">
            You aren't a hero.<br />
            You're <span className="text-cyan text-glow-soft">IT support for reality.</span>
          </p>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Somnium punched a hole into the collective unconscious. The Dreamscape leaks. Physics
            buckles. Zip codes wake up thinking they're fish. You watch the terminal. You hold
            the line. You do not look at the leaks directly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-[11px] tracking-[0.25em]">
            <SpecularButton
              size="md"
              radius={2}
              lineColor="#ff2bd6"
              baseColor="#7a1258"
              textColor="#ffb6ec"
              intensity={1.4}
              shineSize={14}
              shineFade={38}
              proximity={320}
              onClick={() => {
                document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              ► ENTER_TERMINAL
            </SpecularButton>
            <SpecularButton
              size="md"
              radius={2}
              lineColor="#8fd9ff"
              baseColor="#1a4a66"
              textColor="#cfeaff"
              intensity={1.2}
              shineSize={14}
              shineFade={38}
              proximity={320}
              onClick={() => {
                document.getElementById("briefing")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              READ_BRIEFING_04
            </SpecularButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bevel-frame corner-ticks relative p-4">
      <div className="text-[10px] tracking-[0.3em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl text-cyan text-glow-soft">{value}</div>
      <div className="mt-4">
        <SpecularButton
          size="sm"
          radius={2}
          lineColor="#ff2bd6"
          baseColor="#5a1244"
          textColor="#ffd6f2"
          intensity={1.2}
          shineSize={14}
          shineFade={38}
          proximity={220}
        >
          ACCESS
        </SpecularButton>
      </div>
    </div>
  );
}
