import { HeroSection } from "../components/HeroSection";
import { AgentWorkshopSection } from "../components/AgentWorkshopSection";
import { KnowledgeSection } from "../components/KnowledgeSection";
import { Footer } from "../components/Footer";

export function Dashboard() {
  return (
    <div>
      {/* 1. Hero: GTM智能中台大banner */}
      <HeroSection />

      {/* 2. Agent工坊子栏目 */}
      <AgentWorkshopSection />

      {/* 3. 我的知识库子栏目 */}
      <KnowledgeSection />

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}