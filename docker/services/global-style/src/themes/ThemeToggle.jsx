import React, { useContext } from "react";
import { CustomThemeContext } from "./customThemeContext";
import { makeStyles } from "@material-ui/core/styles";
import { Switch } from "@material-ui/core";

export default function ThemeToggle() {
  const { themeMode, changeTheme } = useContext(CustomThemeContext);
  const useStyles = makeStyles((theme) => ({
    root: {
      width: theme.layoutSpacing(50),
      height: theme.layoutSpacing(24),
      padding: "0px !important",
      margin: theme.layoutSpacing(1),
    },
    switchBase: {
      left: theme.layoutSpacing(4),
      top: theme.layoutSpacing(4),
      padding: "0px !important",
      "&$checked": {
        transform: `translateX(${theme.layoutSpacing(28)})`,
        color: theme.palette.common.white,
        "& + $track": {
          backgroundColor: "#52d869",
          opacity: 1,
          border: `3px solid ${theme.palette.background.pureWhite} !important`,
          "&:before": {
            content: '""',
            zIndex: "1000000",
            position: "absolute",
            border: `1px solid ${theme.palette.icons.closeIcon}`,
            top: "0px",
            left: "0",
            height: "100%",
            width: "100%",
            padding: "0px",
            borderRadius: theme.layoutSpacing(12),
          },
        },
      },
    },
    thumb: {
      width: theme.layoutSpacing(15),
      height: theme.layoutSpacing(15),
    },
    track: {
      borderRadius: theme.layoutSpacing(12),
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"]),
    },
    checked: {},
    focusVisible: {},
  }));

  const classes = useStyles(themeMode);

  const handleToggleChange = () => {
    if (
      ((window?.envConfig?.global_style?.VITE_APP_ENV || import.meta.env["VITE_APP_ENV"]) === "uat" ||
        window?.envConfig?.global_style?.VITE_APP_ENV ||
        import.meta.env["VITE_APP_ENV"] === "prod") &&
      location.pathname.startsWith("/projects")
    ) {
      return;
    }
    const themeValue = themeMode === "light" ? "dark" : "light";
    changeTheme(themeValue);
  };
  return (
    <div className={classes.themeButton}>
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        onChange={(e) => handleToggleChange(e, "access")}
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
      />
    </div>
  );
}
