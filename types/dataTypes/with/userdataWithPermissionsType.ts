import { PermissionDataType } from "../permissiondataType";
import { UserDataType } from "../userdataType";

export type UserDataWithPermissionsType = UserDataType & {
  permissions: PermissionDataType[];
};
