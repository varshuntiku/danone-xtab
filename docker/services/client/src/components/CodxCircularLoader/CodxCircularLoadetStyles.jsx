
import {
  nucliosTextColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const LoaderStyles = theme => ({
  loader: {
      fill: nucliosTextColor,
      zIndex: 1,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
  }
});

export default LoaderStyles;
