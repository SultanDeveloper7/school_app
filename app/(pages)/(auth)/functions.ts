import { Apis } from "@/core/apis";
import { HttpReq } from "@/core/http";
import { LoginResponseType } from "@/types/responseTypes/loginResponseType";
import { ResponseType } from "@/types/responseTypes/responseType";
import axios from "axios";

export default async function sendLoginRequest(data: {
  email: string;
  password: string;
}): Promise<ResponseType<LoginResponseType>> {
  try {
    return await HttpReq.post<ResponseType<LoginResponseType>>(Apis.LOGIN_API, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as ResponseType<LoginResponseType>;
      throw data.message || "An unexpected error occurred.";
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
