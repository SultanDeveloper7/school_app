import connect from "@/core/db/db";
import { JwtService } from "@/core/jwt/jwt";
import { response } from "@/core/response";
import { PermissionDataType, SubPermissionDataType } from "@/types/dataTypes/permissiondataType";
import { UserDataType } from "@/types/dataTypes/userdataType";
import { UserDataWithPermissionsType } from "@/types/dataTypes/with/userdataWithPermissionsType";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const authorization = req.cookies.get("access_token")?.value;

  if (!authorization) {
    return response(null, "Access token is missing", "ACCESS_TOKEN_MISSING", 401);
  }
  const token = authorization.replace("Bearer ", "");
  let conn;
  try {
    const jwtService = new JwtService();
    const payload = jwtService.verifyToken(token);
    if (!payload.success) {
      return response(null, payload.message, payload.error, payload.code);
    }
    const userId = payload.payload.user_id;
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
    SELECT sp.*, p.permission_id FROM sub_permission as sp
    JOIN permissions_sub_permissions_rel as psp_rel
    ON psp_rel.sub_permission_id = sp.sub_permission_id
    JOIN permissions as p
    ON p.permission_id = psp_rel.permission_id
    WHERE p.permission_id IN (?)`;

    const permissionIds = permissions.map((p) => p.permission_id);
    const [rows] = await conn.query(sql3, [permissionIds]);
    const subPermissions = rows as SubPermissionDataType[];
    const permissionsWithSubPermissions = permissions.map((permission) => ({
      ...permission,
      sub_permissions: subPermissions.filter((sp) => sp.permission_id === permission.permission_id),
    })) as PermissionDataType[];

    if (data.length === 0) {
      const res = response(null, "User not found", "USER_NOT_FOUND", 404);
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      return res;
    }
    const userDataWithPermissions: UserDataWithPermissionsType = {
      ...data[0],
      permissions: permissionsWithSubPermissions,
    };

    return response(userDataWithPermissions, "User data retrieved successfully", null, 200);
  } catch (error) {
    return response(null, "Something went wrong", "UNKNOWN_ERROR", 501);
  } finally {
    if (conn) await conn.end();
  }
}
