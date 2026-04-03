import reviews from "@/data/reviews.json";
import PortfolioDashboard from "@/components/portfolio-dashboard";
import { ReviewRecord } from "@/lib/types";

export default function Home() {
  return <PortfolioDashboard reviews={reviews as ReviewRecord[]} />;
}
