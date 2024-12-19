// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import ExtensionIcon from "@material-ui/icons/Extension";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AccountCircle from "@material-ui/icons/AccountCircle";
import AcUnit from "@material-ui/icons/AcUnit";

import Projects from "views/Projects/Projects.jsx";

//Widget Factory
import WidgetGroups from "views/Widgets/WidgetGroups.jsx";
import Widgets from "views/Widgets/Widgets.jsx";

//Environments
import Environments from "views/Environments/Environments.jsx";

//Access Control
import UserGroups from "views/RBAC/UserGroups.jsx";
import Users from "views/RBAC/Users.jsx";

import UserProfile from "views/Pages/UserProfile.jsx";

require("dotenv").config();

var dashRoutes = [
  {
    path: "/projects",
    name: "Projects",
    rtlName: "",
    icon: ExtensionIcon,
    component: Projects,
    layout: "/admin",
    access: "admin"
  },
  {
    collapse: true,
    name: "Widget Factory",
    rtlName: "",
    icon: Apps,
    state: "widgetFactoryCollapse",
    access: "widget_factory",
    views: [
      {
        path: "/widget-groups",
        name: "Widget Groups",
        rtlName: "",
        mini: "WG",
        rtlMini: "",
        component: WidgetGroups,
        layout: "/admin",
        access: "widget_factory"
      },
      {
        path: "/widgets",
        name: "Widgets",
        rtlName: "",
        mini: "W",
        rtlMini: "",
        component: Widgets,
        layout: "/admin",
        access: "widget_factory"
      }
    ]
  },
  {
    path: "/environments",
    name: "Environments",
    rtlName: "",
    icon: AcUnit,
    rtlMini: "",
    component: Environments,
    layout: "/admin",
    access: "environments"
  },
  {
    collapse: true,
    name: "Access Control",
    rtlName: "",
    icon: SupervisorAccountIcon,
    state: "accessControlCollapse",
    access: "rbac",
    views: [
      {
        path: "/user-groups",
        name: "User Groups",
        rtlName: "",
        mini: "UG",
        rtlMini: "",
        component: UserGroups,
        layout: "/admin",
        access: "rbac"
      },
      {
        path: "/users",
        name: "Users",
        rtlName: "",
        mini: "U",
        rtlMini: "",
        component: Users,
        layout: "/admin",
        access: "rbac"
      }
    ]
  },
  {
    path: "/user-profile",
    name: "Profile & Settings",
    rtlName: "",
    icon: AccountCircle,
    rtlMini: "",
    component: UserProfile,
    layout: "/admin",
    access: "admin"
  }
];

export default dashRoutes;
