import { grayColor } from "assets/jss/material-dashboard-pro-react.jsx";

import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";

const sweetAlertStyle = {
  cardTitle: {
    marginTop: "0",
    marginBottom: "3px",
    color: grayColor[2],
    fontSize: "18px"
  },
  center: {
    textAlign: "center"
  },
  right: {
    textAlign: "right"
  },
  left: {
    textAlign: "left"
  },
  higherAlert: {
    display: "block",
    top: "40% !important"
  },
  scrollableContent: {
    maxHeight: "400px",
    overflow: "scroll",
    paddingRight: "15px"
  },
  ...buttonStyle
};

export default sweetAlertStyle;
