import {
  whiteColor,
  blackColor,
} from "assets/jss/material-dashboard-pro-react.jsx";

const pagesStyle = theme => ({
  wrapper: {
    height: "100vh",
    position: "relative",
    top: "0"
  },
  fullPage: {
    padding: "120px 5px",
    position: "relative",
    minHeight: "100vh",
    // display: "flex!important",
    margin: "0",
    border: "0",
    color: blackColor,
    alignItems: "center",
    backgroundColor: whiteColor,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      minHeight: "fit-content!important"
    },
    overflow: "auto",
    "& footer": {
      position: "absolute",
      bottom: "0",
      width: "100%",
      border: "none !important"
    },
    // "&:before": {
    //   backgroundColor: ""
    // },
    // "&:before,&:after": {
    //   display: "block",
    //   content: '""',
    //   position: "absolute",
    //   width: "100%",
    //   height: "100%",
    //   top: "0",
    //   left: "0",
    //   zIndex: "2"
    // }
  }

});

export default pagesStyle;
