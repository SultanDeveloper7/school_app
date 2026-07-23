import { UserDataType } from "@/types/dataTypes/userdataType";
import connect from "../db/db";
import { PermissionDataType, SubPermissionDataType } from "@/types/dataTypes/permissiondataType";
import { UserDataWithPermissionsType } from "@/types/dataTypes/with/userdataWithPermissionsType";
import { response } from "../response";

export class PermissionsServices {
  public async getUserPermissions(userId: number): Promise<SubPermissionDataType[]> {
    let conn;
    try {
      conn = await connect();
      const sql = `SELECT u.user_id, u.user_name, u.user_email, u.user_gender, u.school_id, s.school_name, s.school_desc, s.school_address, s.school_created, u.user_role, r.role_name, u.user_created FROM users as u
    LEFT JOIN roles as r
    ON r.role_id = u.user_role
    LEFT JOIN school as s
    ON s.school_id = u.school_id
    WHERE u.user_id = ?`;

      const sql2 = `SELECT p.* FROM users as u
    JOIN role_permissions_rel as rpr
    ON u.user_role = rpr.role_id
    JOIN permissions as p
    ON p.permission_id = rpr.permission_id
    WHERE u.user_id = ?`;

      const [result] = await conn.query(sql, [userId]);
      const [result2] = await conn.query(sql2, [userId]);
      const data = result as UserDataType[];
      const permissions = result2 as PermissionDataType[];
      const sql3 = `
    SELECT *
    FROM sub_permission
    WHERE permission_id IN (?)`;
      const permissionIds = permissions.map((p) => p.permission_id);
      const [rows] = await conn.query(sql3, [permissionIds]);
      const subPermissions = rows as SubPermissionDataType[];
      const permissionsWithSubPermissions = permissions.map((permission) => ({
        ...permission,
        sub_permissions: subPermissions.filter((sp) => sp.permission_id === permission.permission_id),
      })) as PermissionDataType[];

      const userDataWithPermissions: UserDataWithPermissionsType = {
        ...data[0],
        permissions: permissionsWithSubPermissions,
      };

      return subPermissions;
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async checkPermission(permissionCode: string, subPermissionCode: string) {
    
  }
}
