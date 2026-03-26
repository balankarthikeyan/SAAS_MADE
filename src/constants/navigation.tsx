import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

export const NAV_ITEMS = [
  { text: "Dashboard", icon: <DashboardIcon />, href: "/portal/dashboard" },
  { text: "Users", icon: <PeopleIcon />, href: "/portal/users" },
  { text: "Analytics", icon: <BarChartIcon />, href: "/portal/analytics" },
  { text: "Settings", icon: <SettingsIcon />, href: "/portal/settings" },
];
