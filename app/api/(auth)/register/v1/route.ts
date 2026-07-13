import connect from "@/core/db/db";
import { response } from "@/core/response";
import { UserTableType } from "@/types/databaseTypes/userTableType";
import { RegisterRequestType } from "@/types/requestTypes/registerRequestType";
import { ResultSetHeader } from "mysql2";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.json();
  const data: RegisterRequestType = {
    username: formData.username as string,
    email: formData.email as string,
    password: formData.password as string,
    confirmPassword: formData.confirmPassword as string,
    gender: formData.gender as "male" | "female",
  };

  if (!data.username || !data.email || !data.password || !data.confirmPassword || !data.gender) {
    return response(null, "All fields are required", "MISSING_FIELDS", 400);
  }

  if (data.password !== data.confirmPassword) {
    return response(null, "Passwords do not match", "PASSWORD_MISMATCH", 400);
  }
  let conn;
  try {
    conn = await connect();
    const [existingUser] = await conn.execute("SELECT * FROM users WHERE user_email = ? OR user_name = ?", [
      data.email,
      data.username,
    ]);
    const result = existingUser as UserTableType[];
    if (result.length > 0) {
      const text = result[0].user_email === data.email ? "Email" : "Username";
      const codeText = result[0].user_email === data.email ? "EMAIL_EXISTS" : "USERNAME_EXISTS";
      return response(null, `${text} already exists`, codeText, 409);
    }

    const [insertResult] = await conn.execute<ResultSetHeader>(
      "INSERT INTO users (username, email, password, gender) VALUES (?, ?, ?, ?)",
      [data.username, data.email, data.password, data.gender],
    );
    return response({ id: insertResult.insertId }, "User registered successfully", "USER_REGISTERED", 201);
  } catch (error) {
    return response(null, `Server error: ${error}`, "SERVER_ERROR", 500);
  } finally {
    if (conn) await conn.end();
  }
}

// export async function GET(req: NextRequest) {
//     return response(null, "Method not allowed. Use POST.", "METHOD_NOT_ALLOWED", 405);
// }
