import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type NodeState = {
  id: number;
  label: string;
  temp: number;      // 0-100
  load: number;      // 0-100
  status: "ok" | "warn" | "critical" | "offline" | "shutdown";
  coolant: number;   // 0-100 allocated
};

const FEED_LINES = [
  "MASS HALLUCINATION EVENT LOGGED :: 4TH AVE",
  "SUBJECT REPORTS TASTING THE COLOR OF TUESDAY",
  "GRAVITY DELTA +0.13g :: BLOCK 42",
  "12 CIVILIANS SIMULTANEOUSLY DREAM OF SAME DOOR",
  "STOCK TICKER CHANTING IN LATIN — CONTAINED",
  "PIGEONS FLYING BACKWARD OVER FED. RESERVE",
  "CLOCK ON 5TH ST TICKS SIDEWAYS",
  "SUBJECT-7714 RECALLS CHILDHOOD IN A CITY THAT DOES NOT EXIST",
  "RAIN FALLING UPWARD — SECTOR 4-B",
  "ELEVATOR AT WELLS TOWER OPENS ONTO 1997",
  "STREETLIGHTS HUMMING IN F# MINOR",
  "CROWD OF 300 QUIETLY WEEPING, CAUSE UNKNOWN",
  "PHONE LINES CARRYING VOICES OF THE DEAD :: LOW SEVERITY",
  "REALITY PATCH 4.2.19 APPLIED :: LEAK PERSISTS",
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNodes(seed = 42): NodeState[] {
  const rand = mulberry32(seed);
  return Array.from({ length: 16 }, (_, i) => {
    const id = i + 1;
    const near4 = [3, 4, 8, 11, 15].includes(id);   // near sector 4 = hotter
    return {
      id,
      label: `NODE_${String(id).padStart(2, "0")}`,
      temp: near4 ? 68 + rand() * 20 : 30 + rand() * 25,
      load: near4 ? 70 + rand() * 20 : 20 + rand() * 40,
      status: id === 7 || id === 12 ? "offline" : near4 ? "critical" : "ok",
      coolant: 25,
    };
  });
}

export function Terminal() {
  const [nodes, setNodes] = useState<NodeState[]>(makeNodes);
  const [selected, setSelected] = useState<number | null>(4);
  const [feed, setFeed] = useState<string[]>(FEED_LINES.slice(0, 6));
  const [cmd, setCmd] = useState("");
  const [log, setLog] = useState<{ t: string; kind: "ok" | "err" | "info" }[]>([
    { t: "channel established // awaiting operator input", kind: "info" },
  ]);
  const [purged, setPurged] = useState(false);
  const [phase, setPhase] = useState(1); // escalates: 1..4
  const feedRef = useRef<HTMLDivElement>(null);

  // Physics tick — temps drift, coolant reduces, escalation raises baseline
  useEffect(() => {
    const t = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.status === "shutdown") return { ...n, temp: Math.max(20, n.temp - 3), load: 0 };
          if (n.status === "offline")  return { ...n, temp: Math.min(100, n.temp + 0.4), load: 0 };
          const baseline = 0.5 + phase * 0.35;
          const cooling = n.coolant * 0.06;
          const next = Math.max(15, Math.min(100, n.temp + baseline - cooling + (Math.random() - 0.5) * 1.4));
          const status: NodeState["status"] =
            next > 85 ? "critical" : next > 70 ? "warn" : "ok";
          return { ...n, temp: next, status, load: Math.max(5, Math.min(100, n.load + (Math.random() - 0.5) * 4)) };
        }),
      );
    }, 900);
    return () => clearInterval(t);
  }, [phase]);

  // Leak feed autoscroll
  useEffect(() => {
    const t = setInterval(() => {
      setFeed((prev) => {
        const next = [...prev, FEED_LINES[Math.floor(Math.random() * FEED_LINES.length)]];
        return next.slice(-40);
      });
    }, 1600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [feed]);

  // Escalation every 20s: leaks intensify
  useEffect(() => {
    const t = setInterval(() => setPhase((p) => Math.min(4, p + 1)), 22000);
    return () => clearInterval(t);
  }, []);

  // Coolant zero-sum enforcement (max total 400)
  const totalCoolant = useMemo(() => nodes.reduce((s, n) => s + n.coolant, 0), [nodes]);
  const critCount = nodes.filter((n) => n.status === "critical").length;
  const avgTemp = Math.round(nodes.reduce((s, n) => s + n.temp, 0) / nodes.length);
  const stability = Math.max(0, Math.min(100, 100 - avgTemp - critCount * 4 - (phase - 1) * 6));

  function setCoolant(id: number, v: number) {
    setNodes((prev) => {
      const cur = prev.find((n) => n.id === id)!;
      const others = prev.filter((n) => n.id !== id && n.status !== "shutdown" && n.status !== "offline");
      const delta = v - cur.coolant;
      const shareable = others.reduce((s, n) => s + n.coolant, 0);
      if (delta > 0 && delta > shareable) return prev;
      return prev.map((n) => {
        if (n.id === id) return { ...n, coolant: v };
        if (n.status === "shutdown" || n.status === "offline") return n;
        // proportionally remove from others
        const ratio = shareable === 0 ? 0 : n.coolant / shareable;
        return { ...n, coolant: Math.max(0, Math.min(100, n.coolant - delta * ratio)) };
      });
    });
  }

  function shutdown(id: number) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, status: "shutdown" } : n)));
    pushLog(`NODE_${String(id).padStart(2, "0")} :: MANUAL SHUTDOWN OK`, "ok");
  }

  function pushLog(t: string, kind: "ok" | "err" | "info" = "info") {
    setLog((prev) => [...prev.slice(-40), { t, kind }]);
  }

  function runCommand(raw: string) {
    const c = raw.trim().toUpperCase();
    if (!c) return;
    pushLog(`$> ${c}`, "info");
    if (c === "HELP" || c === "?") {
      pushLog("commands: STATUS · SHUTDOWN <n> · ISOLATE SEC-4 · PURGE //SEC-4 · REBOOT", "info");
    } else if (c === "STATUS") {
      pushLog(`avg_temp=${avgTemp}° stability=${stability}% critical=${critCount} phase=${phase}`, "info");
    } else if (c.startsWith("SHUTDOWN")) {
      const n = Number(c.split(/\s+/)[1]);
      if (!Number.isFinite(n)) return pushLog("err: expected node id", "err");
      shutdown(n);
    } else if (c === "ISOLATE SEC-4" || c === "ISOLATE SECTOR-4") {
      setNodes((p) => p.map((n) => ([3,4,8,11,15].includes(n.id) ? { ...n, load: Math.max(20, n.load - 30) } : n)));
      pushLog("sector 4 traffic quarantined // load -30", "ok");
    } else if (c === "REBOOT") {
      setNodes(makeNodes());
      setPurged(false);
      setPhase(1);
      pushLog("full reset // shift restart", "ok");
    } else if (c === "PURGE //SEC-4" || c === "PURGE//SEC-4" || c === "PURGE SEC-4") {
      if (stability < 55) {
        pushLog(`err: stability ${stability}% too low // require ≥ 55%`, "err");
      } else if (critCount > 2) {
        pushLog(`err: ${critCount} nodes critical // cool network first`, "err");
      } else {
        pushLog("dampener frequency deployed :: 42.19 Hz", "ok");
        pushLog("leak collapsing … sector 4 dark", "ok");
        pushLog("▓ REALITY_STABLE ▓", "ok");
        setPurged(true);
      }
    } else {
      pushLog(`err: unknown command '${c}' // try HELP`, "err");
    }
    setCmd("");
  }

  return (
    <section id="terminal" className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-2 text-[10px] tracking-[0.25em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>DASHBOARD_BLUEPRINT // 03</span>
          <span className="text-cyan">
            PHASE_{phase} :: {phase === 1 ? "CONTAINED" : phase === 2 ? "SPREADING" : phase === 3 ? "CASCADE" : "CRITICAL"}
          </span>
        </div>
        <h2 className="mt-2 font-display text-4xl text-foreground sm:text-6xl">
          TERMINAL_V4.2
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Live control surface. Click a node to inspect. Reroute coolant with the sliders — it&apos;s a
          zero-sum loop. Type <span className="text-primary">PURGE //SEC-4</span> when stability holds.
        </p>

        {/* Header stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="AVG_TEMP"     value={`${avgTemp}°C`} tone={avgTemp > 75 ? "alert" : "cyan"} />
          <Stat label="STABILITY"    value={`${stability}%`} tone={stability > 60 ? "ok" : stability > 30 ? "amber" : "alert"} />
          <Stat label="CRITICAL"     value={String(critCount)} tone={critCount > 2 ? "alert" : "cyan"} />
          <Stat label="COOLANT_USED" value={`${Math.round((totalCoolant / (nodes.filter(n=>n.status!=="shutdown"&&n.status!=="offline").length*100 || 1)) * 100)}%`} tone="cyan" />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          {/* LEFT: Topology + Thermal */}
          <div className="space-y-4">
            <Panel title="NODE_TOPOLOGY" sub="4×4 grid // click to inspect">
              <div className="grid grid-cols-4 gap-2">
                {nodes.map((n) => {
                  const tone =
                    n.status === "offline"  ? "border-alert text-alert" :
                    n.status === "shutdown" ? "border-border text-muted-foreground opacity-60" :
                    n.status === "critical" ? "border-alert text-alert" :
                    n.status === "warn"     ? "border-amber text-amber" :
                                              "border-cyan/60 text-cyan";
                  return (
                    <button
                      key={n.id}
                      onClick={() => setSelected(n.id)}
                      className={`relative aspect-square border p-2 text-left transition-colors hover:bg-primary/10 ${tone} ${selected === n.id ? "outline outline-1 outline-primary" : ""}`}
                    >
                      <div className="text-[10px] tracking-[0.2em]">{n.label}</div>
                      <div className="mt-1 font-display text-2xl leading-none">
                        {Math.round(n.temp)}°
                      </div>
                      <div className="mt-1 h-1 w-full bg-muted">
                        <div
                          className="h-full"
                          style={{
                            width: `${n.temp}%`,
                            background: n.status === "critical" ? "var(--color-alert)" : n.status === "warn" ? "var(--color-amber)" : "var(--color-cyan)",
                          }}
                        />
                      </div>
                      <div className="absolute right-1 top-1 text-[9px] uppercase tracking-widest">
                        {n.status === "offline" ? "OFFL" : n.status === "shutdown" ? "OFF" : n.status === "critical" ? "CRIT" : n.status === "warn" ? "WARN" : "OK"}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selected !== null && (() => {
                const n = nodes.find((x) => x.id === selected)!;
                return (
                  <div className="mt-4 border border-border/70 bg-surface/50 p-4">
                    <div className="flex items-center justify-between text-[10px] tracking-[0.25em]">
                      <span className="text-primary">INSPECT :: {n.label}</span>
                      <span className="text-muted-foreground">STATUS: {n.status.toUpperCase()}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                      <div><div className="text-muted-foreground">CPU_LOAD</div><div className="text-cyan">{Math.round(n.load)}%</div></div>
                      <div><div className="text-muted-foreground">TEMP</div><div className="text-cyan">{Math.round(n.temp)}°C</div></div>
                      <div><div className="text-muted-foreground">COOLANT</div><div className="text-cyan">{Math.round(n.coolant)}%</div></div>
                    </div>
                    {(n.status === "offline") && (
                      <button
                        onClick={() => shutdown(n.id)}
                        className="mt-4 border border-alert bg-alert/10 px-3 py-2 text-[11px] tracking-[0.25em] text-alert hover:bg-alert hover:text-primary-foreground"
                      >
                        FORCE_SHUTDOWN
                      </button>
                    )}
                  </div>
                );
              })()}
            </Panel>

            <Panel title="THERMAL_MGMT" sub="zero-sum coolant loop">
              <div className="space-y-2">
                {nodes.filter((n) => n.status !== "shutdown" && n.status !== "offline").slice(0, 8).map((n) => (
                  <div key={n.id} className="grid grid-cols-[90px_1fr_46px] items-center gap-3 text-[11px]">
                    <span className="tracking-[0.2em] text-muted-foreground">{n.label}</span>
                    <input
                      type="range" min={0} max={100} value={n.coolant}
                      onChange={(e) => setCoolant(n.id, Number(e.target.value))}
                      className="somnia-slider w-full accent-[oklch(0.72_0.32_340)]"
                    />
                    <span className="text-right text-cyan tabular-nums">{Math.round(n.coolant)}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[10px] tracking-[0.25em] text-muted-foreground">
                totals lock at network capacity // shifting coolant here starves other nodes
              </div>
            </Panel>
          </div>

          {/* RIGHT: Feed + Dampener */}
          <div className="space-y-4">
            <Panel title="LEAK_DATA_FEED" sub="unfiltered // do not act on individual entries">
              <div
                ref={feedRef}
                className="h-64 overflow-y-auto border border-border/60 bg-surface/50 p-3 text-[11px] leading-6 text-cyan"
              >
                {feed.map((l, i) => (
                  <div key={i}>
                    <span className="text-muted-foreground">{String(i + 1).padStart(3, "0")}</span>{" "}
                    <span className="text-alert">◆</span> {l}
                  </div>
                ))}
                <div className="text-primary">
                  <span className="text-muted-foreground">{String(feed.length + 1).padStart(3, "0")}</span>{" "}
                  <span className="caret" />
                </div>
              </div>
            </Panel>

            <Panel title="DAMPENER_EXEC" sub="no buttons // type the command">
              <div className="h-56 overflow-y-auto border border-border/60 bg-surface/50 p-3 font-mono text-[11px] leading-6">
                {log.map((l, i) => (
                  <div
                    key={i}
                    className={
                      l.kind === "ok" ? "text-ok" :
                      l.kind === "err" ? "text-alert" :
                      "text-cyan/90"
                    }
                  >
                    {l.t}
                  </div>
                ))}
                {purged && (
                  <div className="mt-2 text-ok">
                    ▓ SECTOR 4 CLEAR — SHIFT ADVANCES ▓
                  </div>
                )}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); runCommand(cmd); }}
                className="mt-2 flex items-center gap-2 border border-primary/60 bg-surface/50 px-3 py-2"
              >
                <span className="text-primary">$&gt;</span>
                <input
                  value={cmd}
                  onChange={(e) => setCmd(e.target.value)}
                  spellCheck={false}
                  autoCapitalize="off"
                  placeholder="type HELP"
                  className="w-full bg-transparent font-mono text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button type="submit" className="text-[10px] tracking-[0.3em] text-primary hover:text-foreground">
                  ↵ EXEC
                </button>
              </form>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] tracking-[0.25em] text-muted-foreground">
                {["HELP","STATUS","SHUTDOWN 7","SHUTDOWN 12","ISOLATE SEC-4","PURGE //SEC-4"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => runCommand(s)}
                    className="border border-border px-2 py-1 hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* Escalation bar */}
        <div className="mt-6 border border-border p-4 bg-surface/50">
          <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-muted-foreground">
            <span>LEAK_PRESSURE_OVER_TIME</span>
            <span className="text-primary">PHASE {phase} / 4</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1">
            {[1,2,3,4].map((p) => (
              <div key={p} className={`h-1.5 ${p <= phase ? (p === 4 ? "bg-alert" : "bg-primary") : "bg-muted"}`} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1 text-[10px] tracking-[0.2em]">
            {["CONTAINED","SPREADING","CASCADE","CRITICAL"].map((t, i) => (
              <div key={t} className={i + 1 <= phase ? "text-cyan" : "text-muted-foreground"}>{t}</div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {purged && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border border-ok bg-ok/10 p-4 text-ok"
            >
              INCIDENT_404 :: RESOLVED // reality integrity restored to 99.6% // clock stopped
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface/50 p-4">
      <div className="mb-3 flex items-baseline justify-between border-b border-border/60 pb-2">
        <span className="text-primary text-[11px] tracking-[0.25em]">{title}</span>
        {sub && <span className="text-[10px] tracking-[0.2em] text-muted-foreground">{sub}</span>}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "cyan" | "amber" | "alert" | "ok" }) {
  const cls =
    tone === "alert" ? "text-alert" :
    tone === "amber" ? "text-amber" :
    tone === "ok"    ? "text-ok" :
                       "text-cyan";
  return (
    <div className="border border-border bg-surface/50 p-3">
      <div className="text-[10px] tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl tabular-nums ${cls}`}>{value}</div>
    </div>
  );
}
