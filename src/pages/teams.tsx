import Header from "@/components/header";
import { getTeams } from "@/lib/api";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGlobalStore } from "@/store";
import {
  DataGrid,
  ExportCsv,
  ExportPrint,
  FilterPanelTrigger,
  Toolbar,
  type GridColDef,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { Download, ListFilter, Printer } from "lucide-react";
import users from "./users";

const CustomToolbar = () => (
  <Toolbar className="toolbar flex gap-2">
    <FilterPanelTrigger className="gap-0.5">
      <ListFilter />
      Filters
    </FilterPanelTrigger>
    <ExportCsv className="gap-0.5">
      <Download />
      EXPORT
    </ExportCsv>
    <ExportPrint className="gap-0.5">
      <Printer />
      Print
    </ExportPrint>
  </Toolbar>
);

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 150 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    width: 200,
  },
];

export default function TeamsPage() {
  const {
    data: teams,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
  const isDarkMode = useGlobalStore((state) => state.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          showToolbar={true}
          rows={teams?.data || []}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
}
