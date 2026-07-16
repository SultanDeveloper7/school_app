"use client";

import { UserDataWithPermissionsType } from "@/types/dataTypes/with/userdataWithPermissionsType";
import { useEffect, useState } from "react";
import CustomAppbar from "./components/CustomAppbar";
import CustomDisplay from "./components/CustomDisplay";
import CustomNavBar from "./components/CustomNavBar";
import { DashboardService } from "./functions";

export default function DashboardPage() {
  const [userdata, setUserdata] = useState<UserDataWithPermissionsType | null>(null);
  const [screenIndex, setScreenIndex] = useState<number>(0);
  const dashboardServices = new DashboardService();
  useEffect(() => {
    const init = async () => {
      const response = await dashboardServices.getUserDetails();
      setUserdata(response.data);
    };
    init();
  }, []);

  return (
    userdata && (
      <div className="h-screen flex flex-col">
        <CustomAppbar userdata={userdata} />
        <div className="w-screen flex grow">
          <CustomNavBar permissions={userdata.permissions} />
          <CustomDisplay subPermissions={userdata.permissions[screenIndex].sub_permissions} />
        </div>
      </div>
    )
  );
}
