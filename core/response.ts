import { ResponseType } from "@/types/responseTypes/responseType";
import { NextResponse } from "next/server";

export function response<T>(
  data: T,
  message: string | null,
  code: string | null,
  status: number = 200,
) {
  return NextResponse.json<ResponseType<T>>(
    {
      status: status >= 200 && status < 300 ? "Success" : "Error",
      message,
      code,
      data,
    },
    { status },
  );
}
