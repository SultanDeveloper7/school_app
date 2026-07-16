import { JwtPayloadType } from "@/types/coreTypes/jwtPayloadType";
import { VerifyTokenResultType } from "@/types/coreTypes/verifyTokenResult";
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { RefreshTokenType } from "@/types/databaseTypes/refreshTokenType";
import { CreatedJwtTokenType } from "@/types/coreTypes/createdJwtTokenType";
import { RefreshTokenResultType } from "@/types/coreTypes/refreshTokenResultType";
import { Connection } from "mysql2/promise";

export class JwtService {
  secretToken = process.env.JWT_SECRET as string;
  expriresIn = process.env.JWT_EXPIRES_IN as string;

  public async deleteRefreshTokenFromDb(userId: number, refreshToken: string, conn: Connection) {
    const sql = "DELETE FROM refresh_token WHERE user_id = ? AND refresh_token = ?";
    try {
      const [result] = await conn.execute(sql, [userId, refreshToken]);
      return result;
    } catch (error) {
      console.error("Error deleting refresh token from database:", error);
    }
  }

  public generateToken(payload: JwtPayloadType, isUpdate: boolean = false, conn: Connection): CreatedJwtTokenType | null {
    console.log(`[JWT SUB DEBUG] -- The payload is ${JSON.stringify(payload)}`);

    const token = jwt.sign(payload, this.secretToken, {
      expiresIn: this.expriresIn,
    } as jwt.SignOptions);
    const refreshToken = crypto.randomUUID();
    try {
      if (!isUpdate) {
        this.insertTokenToDb(refreshToken, payload.user_id, conn);
      }
      return { token, refreshToken };
    } catch (error) {
      console.error("Error inserting refresh token into database:", error);
      return null;
    }
  }

  public async insertTokenToDb(refreshToken: string, userId: number, conn: Connection) {
    const sql = "INSERT INTO refresh_token (refresh_token, refresh_created, refresh_expires, user_id) VALUES (?, ?, ?, ?)";
    try {
      const [result] = await conn.execute(sql, [
        refreshToken,
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId,
      ]);
      return result;
    } catch (error) {
      console.error("Error inserting token into database:", error);
    }
  }

  public async updateTokenInDb(oldRefreshToken: string, refreshToken: string, userId: number, conn: Connection) {
    const sql =
      "UPDATE refresh_token SET refresh_token = ?, refresh_created = ?, refresh_expires = ? WHERE user_id = ? AND refresh_token = ?";
    try {
      const [result] = await conn.execute(sql, [
        refreshToken,
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId,
        oldRefreshToken,
      ]);
      return result;
    } catch (error) {
      console.error("Error updating token in database:", error);
    }
  }

  public async refreshToken(refreshToken: string, payload: JwtPayloadType, conn: Connection): Promise<RefreshTokenResultType> {
    const sql = "SELECT * FROM refresh_token WHERE refresh_token = ? AND user_id = ?";
    try {
      const [rows] = await conn.execute(sql, [refreshToken, payload.user_id]);
      const result = rows as RefreshTokenType[];
      if (result.length === 0) {
        return { status: false, message: "Invalid refresh token", error: "INVALID_TOKEN" };
      }
      const currentTime = new Date();
      const tokenExpiryTime = new Date(result[0].refresh_expires);
      if (currentTime > tokenExpiryTime) {
        return { status: false, message: "Refresh token has expired", error: "TOKEN_EXPIRED" };
      }
      const anotherPayload = payload as JwtPayloadType & {
        iat: number;
        exp: number;
      };
      const { iat, exp, ...cleanPayload } = anotherPayload;

      const data = this.generateToken(cleanPayload, true, conn);
      if (!data) {
        return { status: false, message: "Failed to generate new token", error: "UNKNOWN_ERROR" };
      }

      await this.updateTokenInDb(refreshToken, data.refreshToken, payload.user_id, conn);
      return { status: true, data };
    } catch (error) {
      console.error("Error refreshing token:", error);
      return { status: false, message: "An unexpected error occurred", error: "UNKNOWN_ERROR" };
    }
  }

  public verifyToken(authorizationHeader: string): VerifyTokenResultType {
    const token = authorizationHeader.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, this.secretToken) as JwtPayloadType;
      return {
        code: 200,
        success: true,
        payload: decoded,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return {
          code: 401,
          success: false,
          error: "TOKEN_EXPIRED",
          message: "Token has expired",
          payload: jwt.decode(token) as JwtPayloadType | null,
        };
      }
      if (error instanceof NotBeforeError) {
        return {
          code: 401,
          success: false,
          error: "TOKEN_NOT_ACTIVE",
          message: "Token is not active yet",
          payload: jwt.decode(token) as JwtPayloadType | null,
        };
      }
      if (error instanceof JsonWebTokenError) {
        return {
          code: 401,
          success: false,
          error: "INVALID_TOKEN",
          message: error.message,
          payload: jwt.decode(token) as JwtPayloadType | null,
        };
      }
      return {
        code: 500,
        success: false,
        error: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
        payload: jwt.decode(token) as JwtPayloadType | null,
      };
    }
  }
}
