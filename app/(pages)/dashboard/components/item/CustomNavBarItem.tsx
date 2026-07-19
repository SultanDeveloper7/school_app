"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";
import { MouseEventHandler } from "react";

interface CustomNavBarItemProps {
  //   icon: React.ReactNode;
  title: string;
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
}

export default function CustomNavBarItem(props: CustomNavBarItemProps) {
  const { title, onClick } = props;
  return (
    <ListItemButton onClick={onClick}>
      <ListItemIcon>
        <SendIcon sx={{ color: "#dadada" }} />
      </ListItemIcon>
      <ListItemText sx={{ color: "#dadada", fontWeight: "bold" }} disableTypography primary={title} />
    </ListItemButton>
  );
}
