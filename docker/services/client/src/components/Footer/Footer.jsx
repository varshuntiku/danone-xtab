import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import footerStyle from "assets/jss/material-dashboard-pro-react/components/footerStyle";
import CodxNewLogo from 'assets/jss/CodxNewLogo';
import { Typography } from '@material-ui/core';

function Footer({ ...props }) {
  const { classes, fluid, white } = props;
  var container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white
  });
  var anchor =
    classes.a +
    cx({
      [" " + classes.whiteColor]: white
    });
  return (
    <footer className={classes.footer}>
      <div className={container}>
        <div className={classes.left}>
          {/* <div style={{ float: 'left', fontSize: '18px', paddingTop: '3px', paddingRight: '10px' }}>&copy; {1900 + new Date().getYear()}{" "}</div> */}
          <a href="https://themathcompany.com.com" className={anchor}>
          <div className={classes.footer_first}>
                    <div className={classes.footer_logo}>
                            <span className={classes.newLogo}>
                                <CodxNewLogo />
                            </span>
                    </div>
                    <Typography
                        className={classes.footer_text}
                    >
                        {'MathCo'}
                    </Typography>
                    {/* <span className={classes.footer_version}>
                        {import.meta.env['REACT_APP_VERSION']}{' '}
                    </span> */}
                </div>
          </a>
          <br clear="all"/>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
