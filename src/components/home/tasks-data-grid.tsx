import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import type { Task } from "@/shared/types";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

type Props = {
  rows: Task[];
  isDarkMode: boolean;
  loading?: boolean;
};

export default function TasksDataGrid({ rows, isDarkMode, loading }: Props) {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
      <h3 className="mb-4 text-lg font-semibold dark:text-white">Your Tasks</h3>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          columns={taskColumns}
          rows={rows}
          checkboxSelection
          loading={loading}
          getRowClassName={() => "data-grid-row"}
          getCellClassName={() => "data-grid-cell"}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
}
