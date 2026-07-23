import { Apis } from "@/core/apis";
import { HttpReq } from "@/core/http";
import { UserDataWithPermissionsType } from "@/types/dataTypes/with/userdataWithPermissionsType";
import { ResponseType } from "@/types/responseTypes/responseType";

export class CustomTableViewServices {
  public async init(permissionCode: string) {
    if (permissionCode === "STUDENTS") {
    } else if (permissionCode === "CLASSES") {
    }
  }

  private async getStudents() {
    try {
      return await HttpReq.get<ResponseType<UserDataWithPermissionsType>>(Apis.USER_DETAILS_API, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {}
  }
}
