import ReusablePriorityPage from "@/components/reusable-priority-page";
import { Priority } from "@/shared/types";

export default function MediumPage() {
  return <ReusablePriorityPage priority={Priority.Medium} />;
}
