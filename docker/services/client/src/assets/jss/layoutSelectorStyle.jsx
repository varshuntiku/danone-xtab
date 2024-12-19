import { lightGreen } from "@material-ui/core/colors";
import {
  codxDarkColor,
  codxLightColor,
  dangerColor,
  successColor,
  whiteColor,
  grayColor,
} from "assets/jss/material-dashboard-pro-react.jsx";

const layoutSelectorStyle = {
  gridItem: {
    color: codxDarkColor,
    "&:hover": {
      opacity: "0.5"
    },
    padding: '0 8px !important'
  },
  card: {
    display: "inline-block",
    position: "relative",
    width: "100%",
    margin: "0",
    // boxShadow: "0 1px 4px 0 rgba(" + hexToRgb(blackColor) + ", 0.14)",
    // borderRadius: "6px",
    // color: "rgba(" + hexToRgb(blackColor) + ", 0.87)",
    background: whiteColor,
    // transition: "all 300ms linear",
    minHeight: "50px",
    color: "inherit"
  },
  label_card: {
    background: lightGreen[100]
  },
  cardSelected: {
    backgroundColor: codxLightColor
  },
  bigCard: {
    minHeight: "100px"
  },
  halfBigCard: {
    minHeight: "47px"
  },
  fullCard: {
    minHeight: "156px"
  },
  halfCard: {
    minHeight: "75px"
  },
  cardBodyIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    margin: "auto",
    cursor: "pointer",
    color: "inherit"
  },
  cardBodyIconSelected: {
    color: codxLightColor
  },
  cardBodyIconIncomplete: {
    color: dangerColor[0]
  },
  cardBodyIconComplete: {
    color: successColor[0]
  },
  layoutGridRoot: {
    marginTop: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  layoutGrid: {
    flexWrap: 'nowrap',
  },
  layoutGridTile: {
    width: 'auto !important',
    height: 'auto !important'
  },
  layoutContainer: {
    border: "3px solid " + grayColor[0],
    padding: "16px",
    borderRadius: "5px",
    float: "left",
    margin: "0 8px 8px 0",
    cursor: "pointer",
    backgroundColor: grayColor[0],
    "&:hover": {
      borderColor: codxDarkColor,
    },
    width: "300px"
  },
  layoutContainerSelected: {
    backgroundColor: codxDarkColor,
    borderColor: codxDarkColor,
    "&:hover": {
      borderColor: codxDarkColor,
    }
  },
  layoutSelector: {
    // backgroundColor: grayColor[4],
    padding: "16px"
  }
};

export default layoutSelectorStyle;