import { motion } from "motion/react";
import SpecularButton from "@/components/reactbits/SpecularButton";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="relative mx-auto max-w-[1400px] px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            Somnia Firewall // Terminal v4.2
          </span>
          <h1 className="mt-6 font-display text-6xl leading-[0.9] tracking-tight text-foreground sm:text-8xl">
            PROJECT <span className="text-primary">SOMNIA</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg max-w-xl">
            You aren&apos;t a hero. You&apos;re IT support for reality. The Dreamscape leaks;
            the terminal is the only thing holding the line.
          </p>
          <div className="mt-8">
            <SpecularButton
              size="md"
              radius={8}
              lineColor="var(--color-primary)"
              baseColor="var(--color-muted)"
              textColor="var(--color-foreground)"
              intensity={1.2}
              shineSize={12}
              shineFade={40}
              proximity={280}
              onClick={() => {
                document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              ► OPEN_TERMINAL
            </SpecularButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
