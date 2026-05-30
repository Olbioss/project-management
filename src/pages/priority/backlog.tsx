import ReusablePriorityPage from "@/components/reusable-priority-page";
import { Priority } from "@/shared/types";

export default function BacklogPage() {
  return <ReusablePriorityPage priority={Priority.Backlog} />;
}
