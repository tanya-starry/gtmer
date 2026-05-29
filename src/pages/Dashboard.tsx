import { HeroSection } from "../components/HeroSection";
import { AgentWorkshopSection } from "../components/AgentWorkshopSection";
import { KnowledgeSection } from "../components/KnowledgeSection";
import { Footer } from "../components/Footer";

interface DashboardProps {
  isAdmin: boolean;
  onTriggerPassword: () => void;
}

export function Dashboard({ isAdmin, onTriggerPassword }: DashboardProps) {
  return (
    <div>
      {/* 1. Hero: GTM智能中台大banner */}
      <HeroSection />

      {/* 2. Agent工坊子栏目 */}
      <AgentWorkshopSection isAdmin={isAdmin} />

      {/* 3. 我的知识库子栏目 */}
      <KnowledgeSection isAdmin={isAdmin} />

      {/* 4. Footer */}
      <Footer isAdmin={isAdmin} onTriggerPassword={onTriggerPassword} />
    </div>
  );
}
