import SpecularButton from "@/components/reactbits/SpecularButton";

export function MissionBrief({ mm, ss }: { mm: string; ss: string }) {
  return (
    <section id="briefing" className="scanlines border-b border-border bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-4 py-24">
        <div className="flex flex-col gap-4 text-[10px] tracking-[0.3em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>FILE_REF // MISSION_CARD // 02</span>
          <span className="text-alert text-glow">SYS_MSG :: MULTIPLE NODE FAILURES DETECTED</span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="text-primary text-glow text-xs tracking-[0.4em]">INCIDENT_404</div>
            <h2 className="mt-3 font-display text-6xl text-foreground text-glow sm:text-8xl">
              THE PANIC.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              03:00 local. Tuesday. A sudden global market drop just triggered a wave of collective
              panic. Anxiety load is spiking across the Firewall. Automated dampers — usually
              reliable — are failing. A Class-4 Cognitive Leak has opened directly over the
              downtown financial district. Server temps handling that zone are redlining.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Objective code="01" title="ASSESS"    body="Read the Node Topology Map. Find nodes taking the brunt of the load." />
              <Objective code="02" title="REROUTE"   body="Shut down unresponsive nodes. Divert coolant to adjacent overheating servers." />
              <Objective code="03" title="ISOLATE"   body="Lock data traffic out of Sector 4. Prevent cascade into residential zones." />
              <Objective code="04" title="PURGE"     body="Deploy the Cognitive Dampener frequency. Force-close the leak." />
            </div>
          </div>

          <aside className="bevel-frame corner-ticks relative p-6">
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">TIME_TO_CRITICAL_MASS</div>
            <div className="mt-2 font-display text-6xl text-primary text-glow tabular-nums">
              {mm}:{ss}
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <Row k="OPERATOR" v="899-K" />
              <Row k="SHIFT" v="GRAVEYARD" />
              <Row k="SECTOR" v="N-AM // 04" />
              <Row k="LEAK_CLASS" v="04" alert />
              <Row k="OVERRIDES_LEFT" v="03" />
              <Row k="AUTO_DAMPER" v="OFFLINE" alert />
            </div>
            <div className="mt-6 h-2 w-full bg-muted">
              <div className="h-full w-[68%] bg-alert pulse-alert" />
            </div>
            <div className="mt-2 flex justify-between text-[10px] tracking-[0.25em] text-muted-foreground">
              <span>LOAD</span>
              <span className="text-alert">68% // REDLINE</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Objective({ code, title, body }: { code: string; title: string; body: string }) {
  return (
    <div className="group border border-border p-4 transition-colors hover:border-primary">
      <div className="flex items-baseline gap-3">
        <span className="text-primary text-glow font-display text-2xl">{code}</span>
        <span className="text-cyan text-glow-soft tracking-[0.3em] text-xs">{title}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground group-hover:text-foreground/90">{body}</p>
      <div className="mt-3">
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
          EXECUTE
        </SpecularButton>
      </div>
    </div>
  );
}

function Row({ k, v, alert }: { k: string; v: string; alert?: boolean }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-1 tracking-[0.2em]">
      <span className="text-muted-foreground">{k}</span>
      <span className={alert ? "text-alert text-glow" : "text-cyan"}>{v}</span>
    </div>
  );
}
