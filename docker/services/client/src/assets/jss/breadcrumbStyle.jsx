import {
  codxDarkColor,
  codxLightColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const breadcrumbStyle = {
  breadcrumbItemIconContainer: {
    position: "relative",
    marginLeft: "5px",
    padding: "5px 10px 5px 35px",
    fontSize: "18px",
    color: codxLightColor,
    backgroundColor: codxDarkColor,
    borderRadius: "5px",
    "&:hover,&:focus": {
      opacity: 0.65
    }
  },
  breadcrumbItemLogoContainer: {
    position: "relative",
    padding: "0.5rem",
    fontSize: "18px",
    color: codxLightColor,
    borderRadius: "5px",
    "&:hover,&:focus": {
      opacity: 0.65
    }
  },
  breadcrumbLogo: {
    position: "absolute",
    top: "0px",
    left: "0px",
    height: '4rem',
    fill: codxLightColor + ' !important'
  },
  breadcrumbIcon: {
    position: "absolute",
    left: "10px",
    top: "7px",
    fontSize: "0.8rem"
  },
  breadcrumbSeparatorIconContainer: {
    position: "relative",
    padding: "5px 10px",
    margin: "0 5px"
  },
  breadcrumbSeparatorIcon: {
    top: "3px",
    color: codxDarkColor,
    position: "absolute",
    fontSize: "18px",
    left: "5px"
  },
  breadcrumbLightSeparatorIcon: {
    top: "3px",
    color: codxLightColor,
    position: "absolute",
    fontSize: "18px",
    left: "5px"
  }
};

export default breadcrumbStyle;