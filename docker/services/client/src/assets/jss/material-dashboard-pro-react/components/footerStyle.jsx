import {
  defaultFont,
  container,
  containerFluid,
  primaryColor,
  whiteColor,
  grayColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const footerStyle = {
  block: {},
  left: {
    float: "left!important",
    display: "block",
    '& a':{
        position:'absolute'
    }
  },
  right: {
    margin: "0",
    fontSize: "14px",
    float: "right!important",
    padding: "15px"
  },
  footer: {
    bottom: "0",
    borderTop: "1px solid " + grayColor[15],
    padding: "15px 0",
    ...defaultFont,
    zIndex: 4
  },
  container: {
    zIndex: 3,
    ...container,
    position: "relative"
  },
  containerFluid: {
    zIndex: 3,
    ...containerFluid,
    position: "relative"
  },
  a: {
    color: primaryColor[0],
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0",
    width: "auto"
  },
  whiteColor: {
    "&,&:hover,&:focus": {
      color: whiteColor
    }
  },
  footer_first: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
},
footer_text: {
    fontWeight: '500',
    lineHeight: '2.1rem',
    marginRight: '78rem'
},
footer_version: {
    textTransform: 'uppercase',
    lineHeight: '2.1rem',
    marginRight: '2rem'
},
footer_logo: {
    borderRadius: '50%',
    width: '1.8rem',
    height: '1.8rem',
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'center'
},
};
export default footerStyle;
