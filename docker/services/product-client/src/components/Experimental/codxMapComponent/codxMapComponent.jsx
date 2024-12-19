import React, { useState, Suspense } from 'react';
const GoogleMapReact = React.lazy(() => import('google-map-react'));
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    mapsContainer: {
        height: '100%',
        width: '100%'
    },
    infoPopper: {
        zIndex: 10000,
        pointerEvents: 'none',
        position: 'absolute',
        backgroundColor: theme.palette.primary.dark,
        right: '-25%',
        bottom: '-25%',
        height: 'auto',
        width: '25%',
        color: theme.palette.text.default,
        display: 'flex',
        fontSize: '2rem',
        flexDirection: 'column',
        flexWrap: 'wrap',
        padding: '2rem',
        justifyContent: 'space-inbetween',
        visibility: 'none',
        opacity: 0,
        borderRadius: '2rem'
    },
    infoHolder: {
        height: 'auto',
        width: '100%',
        position: 'absolute',
        right: '30%',
        bottom: '30%',
        pointerEvents: 'none',
        zIndex: 10000,
        '&:hover': {
            '& $infoPopper': {
                visibility: 'visible',
                opacity: 1,
                transform: 'translate(0, -20%)',
                transition: 'all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97)'
            }
        }
    },
    mapContainer: {
        height: '100%',
        width: '100%',
        position: 'relative'
    },
    routeContainer: {
        position: 'absolute',
        right: '75%',
        bottom: '95%',
        width: '25%',
        color: 'red',
        fontSize: '3rem',
        zIndex: 10000
    },
    infoIcon: {
        fontSize: '24px',
        color: 'black',
        cursor: 'pointer',
        pointerEvents: 'all',
        zIndex: 10000,
        position: 'fixed',
        right: '2%',
        bottom: '25%',
        background: 'white',
        width: '32px',
        height: '32px'
    },
    details: {
        margin: 0,
        padding: '0.4rem'
    },
    formControl: {
        marginTop: '2rem',
        width: '100%',
        '& label.Mui-focused': {
            color: theme.palette.text.default,
            fontSize: '2rem'
        },
        '& label': {
            fontSize: '1.5rem',
            color: theme.palette.text.default
        },
        '& .MuiSvgIcon-root': {
            fontSize: '25px',
            color: theme.palette.text.titleText
        }
    },
    selectEmpty: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        backgroundColor: theme.palette.background.details
    },
    waiting: {
        color: theme.palette.text.default,
        paddingLeft: '40%',
        paddingTop: '40%',
        fontSize: '2rem'
    }
}));

export default function SimpleMap(params) {
    const mapProps = params?.params?.elements;
    const [googleMap, setGoogleMap] = useState(null);
    const [routes, setRoutes] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routeDetails, setRouteDetails] = useState({});
    const routeIndex = 0;
    const defaultProps = {
        center: {
            lat: 40.756795,
            lng: -73.954298
        },
        zoom: 20
    };
    const googleKey = import.meta.env?.['REACT_APP_GOOGLE_MAPS_KEY'];
    const handleDropDown = (routeIndex) => {
        if (directionsRenderer != null) {
            displayDirections(googleMap, routeIndex);
        }
    };

    const displayDirections = (map, routeIndex) => {
        const google = window.google;
        const directionsService = new google.maps.DirectionsService();
        const origin = mapProps?.start_coordinates
            ? { lat: mapProps?.start?.lat, lng: mapProps?.start?.lng }
            : mapProps?.start;
        const destination = mapProps?.destination_coordinates
            ? { lat: mapProps?.destination?.lat, lng: mapProps?.destination?.lng }
            : mapProps?.destination;
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true,
                avoidFerries: mapProps?.avoidFerries || false,
                avoidHighways: mapProps?.avoidHighways || false,
                avoidTolls: mapProps?.avoidTolls || false
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    let colors = mapProps?.colors;
                    setRoutes(result.routes);
                    result.routes = [result.routes[routeIndex]];
                    if (directionsRenderer != null) {
                        directionsRenderer.setMap(null);
                        setDirectionsRenderer(null);
                    }
                    let renderer = new google.maps.DirectionsRenderer();
                    renderer.setMap(map);
                    renderer.setOptions({
                        polylineOptions: {
                            strokeColor: colors ? colors?.[routeIndex] || 'red' : 'red',
                            strokeWeight: mapProps?.width,
                            clickable: true
                        }
                    });
                    renderer.setDirections(result);
                    setDirectionsRenderer(renderer);
                    let details = result.routes[0].legs[0];
                    let routeInfo = {
                        start_address: details?.start_address,
                        end_address: details?.end_address,
                        distance: details?.distance?.text,
                        duration: details?.duration?.text
                    };
                    setRouteDetails(routeInfo);
                    mapProps?.showDirection && fx(result.routes[0]);
                } else {
                    // console.error(`error fetching directions ${result}`);
                }
            }
        );
        function fx(route) {
            if (route && route.legs) {
                for (let l = 0; l < route.legs.length; ++l) {
                    let leg = route.legs[l];
                    let midPoint = Math.floor(leg.steps.length / 1.75);
                    let midPoint2 = Math.floor(leg.steps.length / 1.5);
                    for (let j = 0; j < leg.steps.length; ++j) {
                        if (j == midPoint || j == midPoint2) {
                            let step = leg.steps[j],
                                start = step.lat_lngs.length ? step.lat_lngs[0] : step.start_point,
                                end = step.lat_lngs.length ? step.lat_lngs[1] : step.end_point,
                                dir =
                                    (Math.atan2(end.lng() - start.lng(), end.lat() - start.lat()) *
                                        180) /
                                        Math.PI +
                                    360,
                                icon = (dir - (dir % 3)) % 120;
                            new google.maps.Marker({
                                position: start,
                                icon: new google.maps.MarkerImage(
                                    'http://maps.google.com/mapfiles/dir_' + icon + '.png',
                                    new google.maps.Size(24, 24),
                                    new google.maps.Point(0, 0),
                                    new google.maps.Point(12, 12)
                                ),
                                map: map,
                                title: Math.round(dir > 360 ? dir - 360 : dir) + '°'
                            });
                        }
                    }
                }
            }
        }
    };

    const apiIsLoaded = (map) => {
        setGoogleMap(map);
        displayDirections(map, routeIndex);
    };

    const classes = useStyles();

    return (
        <div className={classes.mapContainer}>
            <div className={classes.infoHolder}>
                <InfoOutlinedIcon className={classes.infoIcon} />
                <div className={classes.infoPopper}>
                    <p className={classes.details}>
                        <b>Origin :</b>
                        <br /> <i>{routeDetails?.start_address}</i>
                    </p>
                    <p className={classes.details}>
                        <b>Destination :</b> <br />
                        <i> {routeDetails?.end_address}</i>
                    </p>
                    <p className={classes.details}>
                        <b>Distance :</b>
                        <br /> <i> {routeDetails?.distance}</i>
                    </p>
                    <p className={classes.details}>
                        <b>Duration :</b>
                        <br /> <i> {routeDetails?.duration}</i>
                    </p>
                </div>
            </div>
            {routes != null && (
                <div className={classes.routeContainer}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="routes-dropdown">Select route</InputLabel>
                        <Select
                            labelId="routes-dropdown"
                            id="routes-dropdown"
                            label="Routes"
                            className={classes.selectEmpty}
                        >
                            {routes?.map((routes, index) => (
                                <MenuItem
                                    key={'menu_key' + index}
                                    onClick={() => handleDropDown(index)}
                                    value={'route ' + index}
                                >
                                    <em>Route {index}</em>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            )}
            <div className={classes.mapsContainer}>
                <Suspense fallback={<div className={classes.waiting}> Please Wait... </div>}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: googleKey }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                        onChildMouseEnter={defaultProps.onChildMouseEnter}
                        onChildMouseLeave={defaultProps.onChildMouseLeave}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map }) => apiIsLoaded(map)}
                    ></GoogleMapReact>
                </Suspense>
            </div>
        </div>
    );
}
