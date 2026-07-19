"use client";

import { PermissionDataType } from "@/types/dataTypes/permissiondataType";
import List from "@mui/material/List";
import CustomNavBarItem from "./item/CustomNavBarItem";
import { Dispatch, SetStateAction } from "react";

interface CustomNavBarProps {
  permissions: PermissionDataType[];
  setScreenIndex: Dispatch<SetStateAction<number | null>>;
}

export default function CustomNavBar(props: CustomNavBarProps) {
  const { permissions, setScreenIndex } = props;
  return (
    <List
      sx={{ width: "100%", maxWidth: 240, bgcolor: "#3B3B3B" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      // subheader={
      //   <ListSubheader component="div" id="nested-list-subheader">
      //     Nested List Items
      //   </ListSubheader>
      // }
    >
      {permissions.map((permission, index) => {
        return (
          <CustomNavBarItem
            key={permission.permission_id}
            onClick={() => {
              console.log("The index is: " + index);
              setScreenIndex(index);
            }}
            title={permission.permission_title}
          />
        );
      })}
    </List>
  );
  // return (
  //   <div className="w-60 h-full bg-black">
  //     <ul className="flex flex-col gap-2 p-2">
  // {permissions.map((permission) => {
  //   return (
  //     <li key={permission.permission_id} className="text-[#C9C8C8]  bg-[#3B3B3B] p-2 rounded-md">
  //       {permission.permission_title}
  //     </li>
  //   );
  // })}
  //     </ul>
  //   </div>
  // );
}
