"use client";

import { useEffect, useState } from "react";
import CustomAppbar from "./components/CustomAppbar";
import { DashboardService } from "./functions";
import CustomNavBar from "./components/CustomNavBar";
import { UserDataWithPermissionsType } from "@/types/dataTypes/with/userdataWithPermissionsType";
import CustomDisplay from "./components/CustomDisplay";

export default function DashboardPage() {
  const [userdata, setUserdata] = useState<UserDataWithPermissionsType | null>(null);
  const [screenIndex, setScreenIndex] = useState<number>(0);
  const dashboardService = new DashboardService();
  useEffect(() => {
    const init = async () => {
      try {
        const response = await dashboardService.getUserDetails();
        setUserdata(response?.data || null);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
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
