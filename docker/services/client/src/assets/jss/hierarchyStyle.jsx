import {
   hoverColor
  } from "assets/jss/material-dashboard-pro-react.jsx";

const hierarchyStyle = {
  container: {
    height: '100%'
  },
  containerItem: {
    borderRight: '2px dashed #AEACAF'
  },
  stageBody: {
    padding: '0 16px',
    overflow: 'auto',
    height: 'calc(100vh - 275px)'
  },
  stageBodyEmpty: {
    height: 'calc(100vh - 275px)',
    padding: '0 16px',
    display: 'inline',
    position: 'relative',
    textAlign: 'center'
  },
  stageTitle: {
    textAlign: 'left',
    // fontWeight: 'bold',
    fontSize: '1rem',
    paddingLeft: '1rem',
    textTransform: 'capitalie'
  },
  stageItem: {
    margin: '16px 0',
    '&:hover': {
      opacity: '1',
      background:hoverColor
    }
  },
  stageItemIndustry: {
    borderLeftWidth: '10px',
    borderLeftStyle: 'solid',
    margin: '16px 0',
    '&:hover': {
      opacity: '1',
      background:hoverColor
    }
  },
  stageItemIndustrySelected: {
    borderLeftWidth: '10px',
    borderLeftStyle: 'solid',
    margin: '16px 0',
    '&:hover': {
      opacity: '1',
      background:hoverColor
    }
  },
  stageItemIndustryNotSelected: {
    borderLeftWidth: '10px',
    borderLeftStyle: 'solid',
    margin: '16px 0',
    opacity: '0.5',
    '&:hover': {
      opacity: '1',
      background:hoverColor
    }
  },
  stageItemSelected: {
    boxShadow: '0 0 1px 1px #842ef4',
    margin: '16px 0',
    '&:hover': {
      opacity: '1',
      background:hoverColor,
    }
  },
  stageItemNotSelected: {
    opacity: '0.5',
    margin: '16px 0',
    '&:hover': {
      opacity: '1',
      background:hoverColor
    }
  },
  stageItemTitle: {
    position: 'relative',
    fontSize: '15px',
    fontWeight: 'normal',
    paddingRight: '9px',
    fontFamily:'Graphik Compact'
  },
  stageItemTitle1: {
    position: 'relative',
    fontSize: '15px',
    fontWeight: 'normal',
    paddingRight: '34px'
  },
  stageItemTitle2: {
    position: 'relative',
    fontSize: '15px',
    fontWeight: 'normal',
    paddingRight: '59px'
  },
  stageItemTitle3: {
    position: 'relative',
    fontSize: '15px',
    fontWeight: 'normal',
    paddingRight: '84px'
  },
  stageItemTitle4: {
    position: 'relative',
    fontSize: '15px',
    fontWeight: 'normal',
    paddingRight: '109px'
  },
  stageItemCircleContainer1: {
    position: 'absolute',
    top: '-1px',
    right: '-16px',
    width: '25px'
  },
  stageItemCircleContainer2: {
    position: 'absolute',
    top: '-14px',
    right: '-16px',
    width: '25px'
  },
  stageItemCircleContainer3: {
    position: 'absolute',
    top: '-14px',
    right: '-16px',
    width: '50px'
  },
  stageItemCircleContainer4: {
    position: 'absolute',
    top: '-14px',
    right: '-16px',
    width: '75px'
  },
  stageItemCircleContainer5: {
    position: 'absolute',
    top: '-14px',
    right: '-16px',
    width: '100px'
  },
  stageItemCircleContainer6: {
    position: 'absolute',
    top: '-14px',
    right: '-16px',
    width: '125px'
  },
  stageItemCircleContainerIndustry: {
    position: 'absolute',
    top: '-2px',
    right: '0px',
    width: '25px'
  },
  stageItemCircle: {
    float: 'right',
    margin: '5px',
    height: '14px',
    width: '14px'
  }
};

export default hierarchyStyle;