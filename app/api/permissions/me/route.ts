    import { JwtService } from "@/core/jwt/jwt";
    import { response } from "@/core/response";
    import { headers } from "next/headers";

    export async function GET() {
        const requestHeaders = await headers();
        const authorizationHeader = requestHeaders.get("Authorization");
        if (!authorizationHeader) {
            return response(null, "Authorization header is missing", "AUTHORIZATION_HEADER_MISSING", 401);
        }
        const token = authorizationHeader.replace("Bearer ", "");
        const jwtService = new JwtService();
        const payload = jwtService.verifyToken(token);
        if (!payload) {
            return response(null, "Invalid or expired token", "INVALID_TOKEN", 401);
        }
        return response({ data: payload }, "Token is valid", "TOKEN_VALID", 200);
    }