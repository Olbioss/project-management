import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

type Datum = { name: string; count: number };

type ChartColors = {
  bar: string;
  barGrid: string;
  pieFill: string;
  text: string;
};

type Props = {
  taskDistribution: Datum[];
  projectStatus: Datum[];
  chartColors: ChartColors;
};

export default function HomeCharts({
  taskDistribution,
  projectStatus,
  chartColors,
}: Props) {
  return (
    <>
      <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">
          Task Priority Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
            <XAxis dataKey="name" stroke={chartColors.text} />
            <YAxis stroke={chartColors.text} />
            <Tooltip
              contentStyle={{ width: "min-content", height: "min-content" }}
            />
            <Legend />
            <Bar dataKey="count" fill={chartColors.bar} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">
          Project Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
              {projectStatus.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
