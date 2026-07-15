import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BootOverlay } from "@/components/somnia/BootOverlay";
import { TopBar, useCountdown } from "@/components/somnia/TopBar";
import { Hero } from "@/components/somnia/Hero";
import { StorySection } from "@/components/somnia/StorySection";
import { MissionBrief } from "@/components/somnia/MissionBrief";
import { Terminal } from "@/components/somnia/Terminal";
import { Credits } from "@/components/somnia/Credits";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [booted, setBooted] = useState(false);
  const { mm, ss } = useCountdown(42 * 60);
  return (
    <div className="grain min-h-screen bg-background text-foreground">
      {!booted && <BootOverlay onDone={() => setBooted(true)} />}
      <TopBar mm={mm} ss={ss} />
      <main>
        <Hero />
        <StorySection />
        <MissionBrief mm={mm} ss={ss} />
        <Terminal />
        <Credits />
      </main>
    </div>
  );
}
