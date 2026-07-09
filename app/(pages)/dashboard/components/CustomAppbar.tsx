"use client";

import { AppBar } from "@mui/material";
import { DashboardService } from "../functions";
import { UserDataType } from "@/types/dataTypes/userdataType";

interface CustomAppbarProps {
  userdata: UserDataType;
}

export default function CustomAppbar(props: CustomAppbarProps) {
  const { userdata } = props;
  const dashboardService = new DashboardService();
  return (
    <AppBar position="static" color="primary">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center justify-between px-4 gap-4">
          <h1 className="text-white text-lg font-bold">Welcome back, {userdata.user_name}!</h1>
          <div className="border-2 rounded-sm px-2 py-1">
            <p className="text-white text-sm">{userdata.role_name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-gray-300">Profile</button>
          <button className="text-white hover:text-gray-300">Settings</button>
          <button className="text-white hover:text-gray-300" onClick={() => dashboardService.logoutUser()}>
            Logout
          </button>
        </div>
      </div>
    </AppBar>
  );
}
