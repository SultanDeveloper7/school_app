"use client";

import { SubPermissionDataType } from "@/types/dataTypes/permissiondataType";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import CustomStudentTableView from "./displayItem/CustomStudentTableView";
interface CustomDisplayProps {
  subPermissions: SubPermissionDataType[] | undefined;
}

export default function CustomDisplay(props: CustomDisplayProps) {
  const { subPermissions } = props;
  return (
    <div className="bg-[#2e2d2d] grow">
      <HeaderItem subPermissions={subPermissions} />
    </div>
  );
}

interface HeaderItemProps {
  subPermissions: SubPermissionDataType[] | undefined;
}
function HeaderItem(props: HeaderItemProps) {
  const { subPermissions } = props;
  return (
    <div className="w-full bg-[#242424] flex flex-col items-center">
      <button className="flex ml-auto px-2 m-2 border-3 border-[#f25c33] rounded-sm">
        <AddBoxTwoToneIcon sx={{ color: "#f25c33" }} />
        <h3 className="text-[#f25c33] font-bold">{subPermissions![0].sub_permission_title}</h3>
      </button>
      <CustomStudentTableView />
    </div>
  );
}
