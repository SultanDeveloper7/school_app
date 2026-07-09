import { CreatedJwtTokenType } from "./createdJwtTokenType";

export type RefreshTokenResultType =
  | { status: true; data: CreatedJwtTokenType }
  | { status: false; error: "TOKEN_EXPIRED" | "INVALID_TOKEN" | "TOKEN_NOT_ACTIVE" | "UNKNOWN_ERROR"; message: string };
