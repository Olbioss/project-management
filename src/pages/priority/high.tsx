import ReusablePriorityPage from "@/components/reusable-priority-page";
import { Priority } from "@/shared/types";

export default function HighPage() {
  return <ReusablePriorityPage priority={Priority.High} />;
}
