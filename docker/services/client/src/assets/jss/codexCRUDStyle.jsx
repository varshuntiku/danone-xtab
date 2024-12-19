import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";
import {
    nucliosTextColor
   } from "assets/jss/material-dashboard-pro-react.jsx";

const codexCRUDStyle = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  floatRight: {
    float: "right",
    marginBottom: "15px"
  },
  floatLeft: {
    float: "left",
    marginBottom: "15px"
  },
  formCategory: {
    marginBottom: "0",
    fontSize: "14px",
    padding: "10px 0 10px"
  },
  codexFormSelectImageItem: {
    float: "left",
    marginRight: "10px",
    border: "4px solid #FFF",
    cursor: "pointer",
    borderRadius: "5px",
    "&:hover": {
      border: "4px solid #eee"
    },
  },
  codexFormSelectImageItemSelected: {
    float: "left",
    marginRight: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "4px solid #00acc1"
  },
  codexFormSelectImageItemTitle: {
    color: "#00acc1",
    fontWeight: "bold",
    padding: "0 5px"
  },
  codexFormSelectImageItemImage: {
    height: "110px",
    padding: "5px"
  },
  codexFormSelectImageItemContainer: {
    marginTop: "60px",
    padding: "0 10px 10px 10px"
  },
  tableCheckbox: {
    cursor: 'pointer',
    color:nucliosTextColor,
    '&:hover': {
      opacity: '0.75'
    }
  }
};

export default codexCRUDStyle;