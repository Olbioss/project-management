import Header from "@/components/header";
import { getProjects, getTasks } from "@/lib/api";
import { useGlobalStore } from "@/store";
import type { Priority, Project, Task } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

const HomeCharts = lazy(() => import("@/components/home/home-charts"));
const TasksDataGrid = lazy(() => import("@/components/home/tasks-data-grid"));

const CardFallback = ({ label }: { label: string }) => (
  <div className="flex h-[348px] items-center justify-center rounded-lg bg-white p-4 text-gray-400 shadow dark:bg-dark-secondary dark:text-neutral-500">
    {label}
  </div>
);

export default function HomePage() {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks("1"),
  });

  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const isDarkMode = useGlobalStore((state) => state.isDarkMode);

  if (isLoadingTasks || isLoadingProjects) return <div>Loading..</div>;
  if (isErrorTasks || isErrorProjects || !tasks || !projects)
    return <div>Error fetching data</div>;

  const priorityCount = tasks.data.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const statusCount = projects.data.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));
  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Suspense
          fallback={
            <>
              <CardFallback label="Loading chart…" />
              <CardFallback label="Loading chart…" />
            </>
          }
        >
          <HomeCharts
            taskDistribution={taskDistribution}
            projectStatus={projectStatus}
            chartColors={chartColors}
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="md:col-span-2">
              <CardFallback label="Loading tasks…" />
            </div>
          }
        >
          <TasksDataGrid
            rows={tasks.data}
            isDarkMode={isDarkMode}
            loading={isLoadingTasks}
          />
        </Suspense>
      </div>
    </div>
  );
}
