import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";

interface CustomNavBarItemProps {
//   icon: React.ReactNode;
  title: string;
}

export default function CustomNavBarItem(props: CustomNavBarItemProps) {
  const { title } = props;
  return (
    <ListItemButton>
      <ListItemIcon>
        <SendIcon sx={{ color: "#dadada" }} />
      </ListItemIcon>
      <ListItemText sx={{ color: "#dadada", fontWeight: "bold" }} disableTypography primary={title} />
    </ListItemButton>
  );
}
