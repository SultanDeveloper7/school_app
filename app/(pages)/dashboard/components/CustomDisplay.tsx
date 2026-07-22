"use client";

import { PermissionDataType, SubPermissionDataType } from "@/types/dataTypes/permissiondataType";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import CustomStudentTableView from "./displayItem/CustomStudentTableView";
import { useEffect, useState } from "react";
import { DashboardService } from "../functions";
import { GridColDef } from "@mui/x-data-grid";
interface CustomDisplayProps {
  permissions: PermissionDataType | undefined;
}
const dashboardService = new DashboardService();

export default function CustomDisplay(props: CustomDisplayProps) {
  const { permissions } = props;
  const [columns, setColumns] = useState<GridColDef[]>([]);
  useEffect(() => {
    const init = async () => {
      if (!permissions?.permission_id) {
        return;
      }
      const response = await dashboardService.getPermissionsColumns(permissions?.permission_id);
      const columns: GridColDef[] = response.data.map((permissionColum) => {
        return { field: permissionColum.pc_field, headerName: permissionColum.pc_name, width: permissionColum.pc_width };
      });
      setColumns(columns);
    };
    init();
  }, [permissions?.permission_id]);
  return (
    <div className="h-full flex flex-col bg-[#2e2d2d]">
      <HeaderItem subPermissions={permissions?.sub_permissions} gridColDef={columns} />
    </div>
  );
}

interface HeaderItemProps {
  subPermissions: SubPermissionDataType[] | undefined;
  gridColDef: GridColDef[];
}

function HeaderItem({ subPermissions, gridColDef }: HeaderItemProps) {
  return (
    <div className="flex h-full flex-col bg-[#242424]">
      <button className="ml-auto m-2 flex px-2 border-3 border-[#f25c33] rounded-sm">
        <AddBoxTwoToneIcon sx={{ color: "#f25c33" }} />
        <h3 className="text-[#f25c33] font-bold">{subPermissions?.[0]?.sub_permission_title}</h3>
      </button>

      <div className="flex-1 min-h-0">
        <CustomStudentTableView gridColDef={gridColDef} />
      </div>
    </div>
  );
}
