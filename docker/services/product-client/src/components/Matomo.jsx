import React from 'react';
// import NavBar from "components/NavBar.jsx";
import PropTypes from 'prop-types';
// import {
//   Grid,
//   Card,
//   Box,
//   CardHeader,
//   CardActions,
//   CardContent,
//   Avatar,
//   Typography,
//   Button,
//   Container,
//   InputLabel,
//   MenuItem,
//   FormHelperText,
//   FormControl,
//   Select,
//   Backdrop,
//   Fade,
//   Modal,
//   Link
// } from "@material-ui/core";

// import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
// import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
// import { ReactComponent as StoriesLogo } from "assets/img/stories-navbar.svg";
// import { ReactComponent as NavigatorLogo } from "assets/img/navigator-navbar.svg";
// import createPlotlyComponent from "react-plotly.js/factory";
import { withStyles } from '@material-ui/core/styles';
import dashboardStyle from 'assets/jss/dashboardStyle.jsx';
// import { useMatomo } from '@datapunt/matomo-tracker-react'

// const Plotly = window.Plotly;
// const Plot = createPlotlyComponent(Plotly);
function Matomo() {
    // const { classes } = props;
    // const [open, setOpen] = React.useState(false);

    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);

    // const { trackPageView, trackEvent } = useMatomo();

    // const [age, setAge] = React.useState("");

    // const style = {
    //   position: "absolute",
    //   top: "50%",
    //   left: "50%",
    //   transform: "translate(-50%, -50%)",
    //   width: 800,
    //   bgcolor: "background.paper",
    //   border: "2px solid #000",
    //   boxShadow: 24,
    //   p: 4,
    // };

    // const state = {
    //   labels: ["Stories", "Minerva", "User Management", "Admin", "Naviator"],
    //   datasets: [
    //     {
    //       label: "Module Views count",
    //       backgroundColor: [
    //         "#B21F00",
    //         "#C9DE00",
    //         "#2FDE00",
    //         "#00A6B4",
    //         "#6800B4",
    //       ],
    //       hoverBackgroundColor: [
    //         "#501800",
    //         "#4B5000",
    //         "#175000",
    //         "#003350",
    //         "#35014F",
    //       ],
    //       data: [65, 59, 80, 81, 56],
    //     },
    //   ],
    // };

    // const data = {
    //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    //   datasets: [
    //     {
    //       label: "Page Entries",
    //       data: [33, 53, 85, 41, 44, 65],
    //       fill: true,
    //       backgroundColor: "rgba(75,192,192,0.2)",
    //       borderColor: "rgba(75,192,192,1)",
    //     },
    //     {
    //       label: "Page Exits",
    //       data: [33, 25, 35, 51, 54, 76],
    //       borderColor: "#742774",
    //       backgroundColor: "rgba(133, 0, 150, 0.32)",
    //       fill: true,
    //     },
    //   ],
    // };
    // const dataofpageviews = {
    //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    //   datasets: [
    //     {
    //       label: "Unique App Views",
    //       data: [100, 53, 85, 41, 44, 65],
    //       fill: true,
    //       backgroundColor: "rgba(75,192,192,0.2)",
    //       borderColor: "rgba(75,192,192,1)",
    //     },
    //   ],
    // };

    // const trackButtonClick = () => {

    // };

    return <div>{/* <NavBar /> */}</div>;
}
Matomo.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...dashboardStyle(theme)
    }),
    { withTheme: true }
)(Matomo);
