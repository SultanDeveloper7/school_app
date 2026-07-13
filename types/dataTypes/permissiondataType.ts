import { IconsTableType } from "../databaseTypes/iconsTableType";

export type PermissionDataType = {
  permission_id: number;
  permission_title: string;
  permission_code: string;
  permission_created: Date;
  sub_permissions?: SubPermissionDataType[];
  icon?: IconsTableType;
};

export type SubPermissionDataType = {
  sub_permission_id: number;
  sub_permission_title: string;
  sub_permission_code: string;
  permission_id: number;
  sub_permission_created: Date;
};
