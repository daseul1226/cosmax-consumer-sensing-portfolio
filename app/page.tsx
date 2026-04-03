import PortfolioDashboard from "@/components/portfolio-dashboard";
import { reviewEvidence } from "@/data/review-evidence";

export default function Home() {
  return <PortfolioDashboard evidenceItems={reviewEvidence} />;
}
