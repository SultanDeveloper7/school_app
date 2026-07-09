import { JwtPayloadType } from "./jwtPayloadType";

export type VerifyTokenResultType =
  | { success: true; payload: JwtPayloadType, code: number }
  | {
      success: false;
      code: number;
      error: "TOKEN_EXPIRED" | "INVALID_TOKEN" | "TOKEN_NOT_ACTIVE" | "UNKNOWN_ERROR";
      message: string;
      payload: JwtPayloadType | null;
    };
