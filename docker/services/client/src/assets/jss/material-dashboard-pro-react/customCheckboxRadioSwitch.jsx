import {
  codxDarkColor,
  dangerColor,
  grayColor,
  blackColor,
  whiteColor,
  hexToRgb,
  nucliosTextColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const customCheckboxRadioSwitch = {
  checkRoot: {
    padding: "14px"
  },
  radioRoot: {
    padding: "16px"
  },
  checkboxAndRadio: {
    position: "relative",
    display: "block",
    marginTop: "10px",
    marginBottom: "10px"
  },
  checkboxAndRadioHorizontal: {
    position: "relative",
    display: "block",
    "&:first-child": {
      marginTop: "10px"
    },
    "&:not(:first-child)": {
      marginTop: "-14px"
    },
    marginTop: "0",
    marginBottom: "0"
  },
  checked: {
    color: codxDarkColor + " !important"
  },
  checkedIcon: {
    width: "20px",
    height: "20px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    borderRadius: "3px"
  },
  uncheckedIcon: {
    width: "0px",
    height: "0px",
    padding: "9px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    borderRadius: "3px"
  },
  disabledCheckboxAndRadio: {
    "& $checkedIcon,& $uncheckedIcon,& $radioChecked,& $radioUnchecked": {
      borderColor: blackColor,
      opacity: "0.26",
      color: blackColor
    }
  },
  label: {
    cursor: "pointer",
    paddingLeft: "0",
    color: nucliosTextColor,
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    display: "inline-flex",
    transition: "0.3s ease all"
  },
  labelHorizontal: {
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    paddingTop: "39px",
    marginRight: "0",
    "@media (min-width: 992px)": {
      float: "right"
    }
  },
  labelHorizontalRadioCheckbox: {
    paddingTop: "22px"
  },
  labelLeftHorizontal: {
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    paddingTop: "22px",
    marginRight: "0"
  },
  labelError: {
    color: dangerColor[0]
  },
  radio: {
    color: codxDarkColor + " !important"
  },
  radioChecked: {
    width: "16px",
    height: "16px",
    border: "1px solid " + codxDarkColor,
    borderRadius: "50%"
  },
  radioUnchecked: {
    width: "0px",
    height: "0px",
    padding: "7px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    borderRadius: "50%"
  },
  inlineChecks: {
    marginTop: "8px"
  },
  iconCheckbox: {
    height: "116px",
    width: "116px",
    color: grayColor[0],
    padding: "0",
    margin: "0 auto 20px",
    "& > span:first-child": {
      borderWidth: "4px",
      borderStyle: "solid",
      borderColor: grayColor[9],
      textAlign: "center",
      verticalAlign: "middle",
      borderRadius: "50%",
      color: "inherit",
      transition: "all 0.2s"
    },
    "&:hover": {
      color: codxDarkColor,
      "& > span:first-child": {
        borderColor: codxDarkColor
      }
    }
  },
  iconCheckboxChecked: {
    color: codxDarkColor + " !important",
    "& > span:first-child": {
      borderColor: codxDarkColor
    }
  },
  iconCheckboxIcon: {
    fontSize: "40px",
    lineHeight: "111px"
  },
  switchBase: {
    color: codxDarkColor + " !important"
  },
  switchIcon: {
    boxShadow: "0 1px 3px 1px rgba(" + hexToRgb(blackColor) + ", 0.4)",
    color: whiteColor + " !important",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    transform: "translateX(-4px)!important"
  },
  switchIconChecked: {
    borderColor: codxDarkColor,
    transform: "translateX(0px)!important"
  },
  switchBar: {
    width: "30px",
    height: "15px",
    backgroundColor: "rgb("+hexToRgb(grayColor[18])+")",
    borderRadius: "15px",
    opacity: "0.7!important"
  },
  switchChecked: {
    "& + $switchBar": {
      backgroundColor: "rgba(" + hexToRgb(codxDarkColor) + ", 1) !important"
    }
  }
};

export default customCheckboxRadioSwitch;
