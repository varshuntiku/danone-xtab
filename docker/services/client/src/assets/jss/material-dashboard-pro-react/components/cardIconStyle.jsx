import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  codxDarkColor,
  infoCardHeader,
  primaryCardHeader,
  codxLightCardHeader,
  roseCardHeader,
  grayColor
} from "assets/jss/material-dashboard-pro-react.jsx";
const cardIconStyle = {
  cardIcon: {
    "&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader,&$codxLightCardHeader": {
      borderRadius: "3px",
      backgroundColor: grayColor[0],
      padding: "15px",
      marginTop: "-20px",
      marginRight: "15px",
      float: "left"
    },
    "&$codxLightCardHeader": {
      color: codxDarkColor
    }
  },
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  codxLightCardHeader,
  roseCardHeader
};

export default cardIconStyle;
