import Header from "@/components/header";
import { getUsers } from "@/lib/api";
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
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          <img
            src={`/${params.value}`}
            alt={params.row.username}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
      </div>
    ),
  },
];

export default function UsersPage() {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const isDarkMode = useGlobalStore((state) => state.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          showToolbar={true}
          rows={users?.data || []}
          columns={columns}
          getRowId={(row) => row.userId}
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
