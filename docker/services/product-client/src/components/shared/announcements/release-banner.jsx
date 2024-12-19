import React, { useEffect, useState } from 'react';
import releaseBannerStyles from './styles';
import { makeStyles } from '@material-ui/core';
import { getBannerInfo } from 'services/dashboard';
import sanitizeHtml from 'sanitize-html-react';

const useStyles = makeStyles(releaseBannerStyles);

const ReleaseBanner = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [bannerContent, setBannerContent] = useState('');

    useEffect(() => {
        const getReleaseInfo = async () => {
            setOpen(false);
            await getBannerInfo({
                callback: (data) => {
                    setBannerContent(sanitizeHtml(data.banner_content));
                }
            });
            setOpen(true);
        };

        getReleaseInfo();
    }, []);

    const bannerContainer = (
        <div className={classes.bannerContainer}>
            <div
                className={classes.bannerContent}
                dangerouslySetInnerHTML={{ __html: bannerContent }}
            ></div>
            <div className={classes.closeButton} onClick={() => setOpen(false)}>
                X
            </div>
        </div>
    );

    return open ? bannerContainer : <></>;
};

export default ReleaseBanner;
