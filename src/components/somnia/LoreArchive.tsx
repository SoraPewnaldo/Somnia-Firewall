import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// ── Corrupted lore archive. Solve each fragment to "patch" the record. ──
// Each puzzle is a tiny CTF (caesar, base64, XOR, anagram). Solving it
// reveals the true entry and advances the archive integrity score.

type Puzzle = {
  id: string;
  file: string;
  clue: string;
  hint: string;
  ciphertext: string;
  answers: string[]; // lower-case accepted answers
  revealed: string;
};

const PUZZLES: Puzzle[] = [
  {
    id: "F-001",
    file: "/archive/incident_042.log",
    clue: "Caesar cipher. Each letter was shifted +7. Shift it back by 7 to recover the codename.",
    hint: "Shift each letter BACK 7 places in the alphabet. Example: H→A, I→B, J→C. So W→P, V→O, Y→R … keep going.",
    ciphertext: "WVYAHS",
    answers: ["portal"],
    revealed:
      "SUBJECT-7714 walked through PORTAL 4B and returned with a childhood that never happened. First confirmed lore-leak.",
  },
  {
    id: "F-002",
    file: "/archive/manifest.b64",
    clue: "Base64 payload. Decode it — the plaintext IS the answer.",
    hint: "Open DevTools console and run: atob(\"U0VDVE9SXzQ=\"). Or paste the string into any online base64 decoder.",
    ciphertext: "U0VDVE9SXzQ=",
    answers: ["sector_4", "sector 4", "sector4"],
    revealed:
      "SECTOR_4 is not a place. It is a memory the city agreed to forget. Somnia's firewall is what holds the agreement.",
  },
  {
    id: "F-003",
    file: "/archive/dampener.spec",
    clue: "Frequency = (sum of the sector-4 node ids) / 2. Sector-4 nodes: 3, 4, 8, 11, 15.",
    hint: "Add them: 3 + 4 + 8 + 11 + 15 = 41. Divide by 2. Type the result as a decimal, no units (e.g. 12.5).",
    ciphertext: "FREQ = ??.?? Hz",
    answers: ["20.5"],
    revealed:
      "The dampener runs at 20.5 Hz — half the sum of sector-4 nodes. Somnia's engineers tuned it to the district's heartbeat.",
  },
  {
    id: "F-004",
    file: "/archive/operator_oath.txt",
    clue: "Anagram — unscramble these 8 letters into the founder's last word.",
    hint: "8 letters: I, N, S, O, M, N, I, A. It's what happens when you never sleep. Starts with 'IN', ends with 'IA'.",
    ciphertext: "I · N · S · O · M · N · I · A  (scrambled)",
    answers: ["insomnia"],
    revealed:
      "Founder's last transmission: 'INSOMNIA is the price. Sleep on shift and the city dreams you gone.' Somnia = the firewall against her final dream.",
  },
];

const CORRUPTED_JSON = `{
  "project": "SOMNIA",
  "build": "4.2.19",
  "operator": "you",
  "shift": "graveyard",
  "archive_integrity": <computed>,
  "entries": [
    { "id": "F-001", "file": "/archive/incident_042.log", "status": "██████" },
    { "id": "F-002", "file": "/archive/manifest.b64",     "status": "██████" },
    { "id": "F-003", "file": "/archive/dampener.spec",    "status": "██████" },
    { "id": "F-004", "file": "/archive/operator_oath.txt","status": "██████" }
  ],
  "note": "records corrupted during last cascade. patch by solving fragments."
}`;

export function LoreArchive() {
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [openHint, setOpenHint] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Load persisted progress after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem("somnia.archive.v1");
      if (raw) {
        const parsed = JSON.parse(raw) as {
          solved?: Record<string, boolean>;
          revealed?: Record<string, boolean>;
        };
        if (parsed.solved) setSolved(parsed.solved);
        if (parsed.revealed) setRevealed(parsed.revealed);
      }
    } catch {
      /* corrupted storage — ignore */
    }
    setHydrated(true);
  }, []);

  // Persist whenever progress changes (after initial load).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        "somnia.archive.v1",
        JSON.stringify({ solved, revealed }),
      );
    } catch {
      /* quota / private mode — ignore */
    }
  }, [solved, revealed, hydrated]);

  function resetProgress() {
    setSolved({});
    setRevealed({});
    setInputs({});
    setErrors({});
    try {
      localStorage.removeItem("somnia.archive.v1");
    } catch {
      /* ignore */
    }
  }

  const integrity = useMemo(() => {
    const n = PUZZLES.filter((p) => solved[p.id]).length;
    return Math.round((n / PUZZLES.length) * 100);
  }, [solved]);

  const allDone = integrity === 100;

  function submit(p: Puzzle) {
    const val = (inputs[p.id] || "").trim().toLowerCase();
    if (p.answers.includes(val)) {
      setSolved((s) => ({ ...s, [p.id]: true }));
      setErrors((e) => ({ ...e, [p.id]: false }));
    } else {
      setErrors((e) => ({ ...e, [p.id]: true }));
    }
  }

  function reveal(p: Puzzle) {
    setInputs((s) => ({ ...s, [p.id]: p.answers[0] }));
    setSolved((s) => ({ ...s, [p.id]: true }));
    setErrors((e) => ({ ...e, [p.id]: false }));
    setRevealed((r) => ({ ...r, [p.id]: true }));
  }

  return (
    <section id="archive" className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-2 text-[10px] tracking-[0.25em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>LORE_ARCHIVE // 04</span>
          <span className="flex items-center gap-3">
            <span className={allDone ? "text-ok" : "text-primary"}>
              INTEGRITY :: {integrity}%
            </span>
            {integrity > 0 && (
              <button
                type="button"
                onClick={resetProgress}
                className="text-muted-foreground hover:text-alert"
              >
                ↺ RESET
              </button>
            )}
          </span>
        </div>
        <h2 className="mt-2 font-display text-4xl text-foreground sm:text-6xl">
          PATCH_THE_RECORD
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Four archive files corrupted during the last cascade. Solve each
          fragment to restore the entry. This is how Somnia&apos;s history gets
          written — one decrypt at a time.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          {/* JSON manifest */}
          <div className="border border-border bg-surface/50">
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-2 text-[10px] tracking-[0.25em] text-muted-foreground">
              <span>ARCHIVE_MANIFEST.JSON</span>
              <span className="text-cyan">read-only</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-6 text-cyan/90">
{CORRUPTED_JSON.replace("<computed>", String(integrity))
  .split("\n")
  .map((line, i) => {
    const match = line.match(/"id": "(F-\d+)"/);
    const id = match?.[1];
    if (id && solved[id]) {
      return line.replace("██████", "restored");
    }
    return line;
  })
  .join("\n")}
            </pre>
          </div>

          {/* Puzzle stack */}
          <div className="space-y-3">
            {PUZZLES.map((p) => {
              const done = !!solved[p.id];
              const err = !!errors[p.id];
              return (
                <div
                  key={p.id}
                  className={`border p-4 ${done ? "border-ok/60 bg-ok/5" : "border-border bg-surface/50"}`}
                >
                  <div className="flex items-center justify-between text-[10px] tracking-[0.25em]">
                    <span className={done ? "text-ok" : "text-primary"}>
                      {p.id} :: {p.file}
                    </span>
                    <span className={done ? "text-ok" : "text-muted-foreground"}>
                      {done ? "RESTORED" : "CORRUPTED"}
                    </span>
                  </div>
                  <div className="mt-2 text-[13px] text-foreground">{p.clue}</div>
                  <div className="mt-2 font-mono text-[12px] text-cyan">
                    {p.ciphertext}
                  </div>

                  {!done && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        submit(p);
                      }}
                      className="mt-3 flex items-center gap-2 border border-primary/60 bg-background/60 px-3 py-2"
                    >
                      <span className="text-primary">$&gt;</span>
                      <input
                        value={inputs[p.id] || ""}
                        onChange={(e) => {
                          setInputs((s) => ({ ...s, [p.id]: e.target.value }));
                          if (err) setErrors((s) => ({ ...s, [p.id]: false }));
                        }}
                        placeholder="answer"
                        spellCheck={false}
                        autoCapitalize="off"
                        className="w-full bg-transparent font-mono text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="text-[10px] tracking-[0.3em] text-primary hover:text-foreground"
                      >
                        ↵ SUBMIT
                      </button>
                    </form>
                  )}

                  <div className="mt-2 flex items-center gap-3 text-[10px] tracking-[0.25em]">
                    {!done && (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenHint(openHint === p.id ? null : p.id)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {openHint === p.id ? "▾ HINT" : "▸ HINT"}
                        </button>
                        <button
                          type="button"
                          onClick={() => reveal(p)}
                          className="text-muted-foreground hover:text-alert"
                        >
                          ⚠ REVEAL
                        </button>
                      </>
                    )}
                    {err && !done && (
                      <span className="text-alert">err: no match // try again</span>
                    )}
                    {done && revealed[p.id] && (
                      <span className="text-amber">revealed // no integrity bonus</span>
                    )}
                  </div>
                  {openHint === p.id && !done && (
                    <div className="mt-2 border-l-2 border-primary/60 pl-3 text-[11px] text-muted-foreground">
                      {p.hint}
                    </div>
                  )}

                  <AnimatePresence>
                    {done && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 overflow-hidden border-l-2 border-ok/60 pl-3 text-[12px] leading-6 text-foreground"
                      >
                        <span className="text-[10px] tracking-[0.25em] text-ok">
                          ENTRY_RESTORED&nbsp;»&nbsp;
                        </span>
                        {p.revealed}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border border-ok bg-ok/10 p-4"
            >
              <div className="text-[10px] tracking-[0.25em] text-ok">
                ARCHIVE_INTEGRITY :: 100% // LORE PATCHED
              </div>
              <div className="mt-2 text-sm text-foreground">
                You didn&apos;t stop the leak. You <em>documented</em> it. The
                city goes back to forgetting Sector 4 — and now the record
                remembers <span className="text-primary">why</span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}