import connect from "@/core/db/db";
import { response } from "@/core/response";
import { PermissionsColumnTableType } from "@/types/databaseTypes/permissionsColumnTableType";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return response(null, "No id provided", "BAD_REQUEST", 400);
  }
  let conn;
  try {
    conn = await connect();
    const sql = "SELECT * FROM permissions_column WHERE permission_id = ?";
    const [results] = await conn.query(sql, [id]);
    const data = results as PermissionsColumnTableType[];
    if (data.length === 0) {
      return response(null, "Invalid Id provided", "BAD_REQUEST", 400);
    }
    return response<PermissionsColumnTableType[]>(data, "Success", "VALID_REQUEST", 200);
  } catch (error) {
  } finally {
  }
}
