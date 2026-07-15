import { createFileRoute } from "@tanstack/react-router";
import { TopBar, useCountdown } from "@/components/somnia/TopBar";
import { Hero } from "@/components/somnia/Hero";
import { Terminal } from "@/components/somnia/Terminal";
import { LoreArchive } from "@/components/somnia/LoreArchive";
import { Credits } from "@/components/somnia/Credits";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mm, ss } = useCountdown(42 * 60);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar mm={mm} ss={ss} />
      <main>
        <Hero />
        <Terminal />
        <LoreArchive />
        <Credits />
      </main>
    </div>
  );
}
