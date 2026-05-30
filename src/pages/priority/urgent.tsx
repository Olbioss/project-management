import ReusablePriorityPage from "@/components/reusable-priority-page";
import { Priority } from "@/shared/types";

export default function UrgentPage() {
  return <ReusablePriorityPage priority={Priority.Urgent} />;
}
