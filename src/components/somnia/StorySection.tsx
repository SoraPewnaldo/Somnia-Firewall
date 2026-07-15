export function StorySection() {
  return (
    <section className="scanlines border-b border-border">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-24 md:grid-cols-[280px_1fr]">
        <aside className="text-[10px] tracking-[0.3em] text-muted-foreground">
          <div className="text-primary text-glow">// WORLD_LOG</div>
          <div className="mt-2 text-foreground">TEN YEARS AGO</div>
          <div className="mt-8 space-y-1 text-muted-foreground">
            <div>ENTRY 01 — SOMNIUM</div>
            <div>ENTRY 02 — THE LEAK</div>
            <div>ENTRY 03 — THE DAM</div>
            <div>ENTRY 04 — YOU</div>
          </div>
        </aside>
        <div className="space-y-10">
          <Entry
            id="01"
            title="SOMNIUM_INC. TRIED TO CURE PTSD."
            body="They linked human minds inside a shared digital space. It worked. It worked far too well. They accidentally punched a hole into the collective unconscious — a chaotic, unmapped dimension where every human thought, fear, and half-remembered dream pools together."
          />
          <Entry
            id="02"
            title="NOW THE DREAMSCAPE LEAKS INTO REALITY."
            body="If a leak gets large enough, local physics buckles. Gravity shifts. Memories overwrite. A commuter forgets which way is up. A whole avenue collectively remembers a childhood pet that never existed."
          />
          <Entry
            id="03"
            title="THE SOMNIA FIREWALL WAS BUILT IN 47 DAYS."
            body="A jury-rigged server farm suspended over the Pacific. It acts as a dam between our world and literal nightmares — held together by experimental cooling pipes, duct tape, and sleep-deprived technicians."
          />
          <Entry
            id="04"
            title="YOU WATCH THE TERMINAL."
            body="L3 Sync Tech. Graveyard shift. Track cognitive leaks across city sectors. Manually allocate server power. Patch the holes before Critical Mass. If you fail, a zip code might wake up thinking they're fish."
          />
        </div>
      </div>
    </section>
  );
}

function Entry({ id, title, body }: { id: string; title: string; body: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-6">
      <div className="font-display text-5xl text-primary text-glow leading-none">{id}</div>
      <div>
        <h3 className="font-display text-2xl text-foreground text-glow sm:text-3xl">{title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {body}
        </p>
      </div>
    </div>
  );
}
