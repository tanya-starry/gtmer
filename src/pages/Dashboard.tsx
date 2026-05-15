import { HeroSection } from "../components/HeroSection";
import { AgentWorkshopSection } from "../components/AgentWorkshopSection";
import { KnowledgeSection } from "../components/KnowledgeSection";
import { Footer } from "../components/Footer";

export function Dashboard() {
  return (
    <div>
      <HeroSection />
      <AgentWorkshopSection />
      <KnowledgeSection />
      <Footer />
    </div>
  );
}
