import { Apis } from "@/core/apis";
import { HttpReq } from "@/core/http";
import { UserDataWithPermissionsType } from "@/types/dataTypes/with/userdataWithPermissionsType";
import { ResponseType } from "@/types/responseTypes/responseType";
import axios from "axios";

export class DashboardService {
  public logoutUser() {
    return fetch(Apis.LOGOUT_API, {
      method: "GET",
    });
  }

  public async getUserDetails(): Promise<ResponseType<UserDataWithPermissionsType>> {
    try {
      return await HttpReq.get<ResponseType<UserDataWithPermissionsType>>(Apis.USER_DETAILS_API, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ResponseType<UserDataWithPermissionsType>;
        throw data.message || "An unexpected error occurred.";
      } else {
        throw new Error("An unexpected error occurred.");
      }
    }
  }
}
