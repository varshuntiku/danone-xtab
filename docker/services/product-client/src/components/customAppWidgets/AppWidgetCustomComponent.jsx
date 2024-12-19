import React from 'react';
import { useTheme } from '@material-ui/core';
import CustomTest from './CustomTest';
import CustomImageRenderComponent from '../Experimental/CustomImageRenderComponent';
import OverviewFlow from '../Experimental/WorkflowDiagram/CodxWorkflow';
import ImageGallary from '../Experimental/imageGallary/imageGallary';
import CodxCarouselView from '../Experimental/codxComponentCarousel/codxCarouselView';
import VideoStreaming from '../Experimental/videoStreamingComponent/videoStreaming';
import AskCodx from '../Experimental/askCodxComponent/AskCodx';
import CustomProgressRendererComponent from '../Experimental/progressRendererComponent/progressRendererComponent';
import CustomTypography from '../Experimental/CustomTypography';
import CodxMapComponent from '../Experimental/codxMapComponent/codxMapComponent';
import CustomAudience from '../Experimental/CustomAudience/CustomAudience';
import DataScout from 'components/Experimental/dataScout/DataScout';
import CodxExtraLoader from 'components/CodxExtraLoader';
import Diagnoseme from 'components/Diagnoseme/landingPage';
import LandingPageClone from 'components/Diagnoseme-clone/landingPage';
import UploadImage from 'components/UploadImage/UploadImage';
import ProductSearch from 'components/Experimental/productSearch/ProductSearch';

export default function AppWidgetCustomComponent({ params, onEventTrigger, ...props }) {
    const theme = useTheme();
    switch (params.componentType) {
        case 'custom:test':
            return <CustomTest params={params} {...props} />;
        case 'custom:codxComponentCarousel':
            return <CodxCarouselView params={params} onEventTrigger={onEventTrigger} {...props} />;
        case 'custom:imageRender':
            return <CustomImageRenderComponent params={params} {...props} />;
        case 'custom:workflow':
            return <OverviewFlow params={params} {...props} key={theme.props.mode} />;
        case 'custom:imageGallary':
            return <ImageGallary params={params} {...props} />;
        case 'custom:videoStreamComponent':
            return <VideoStreaming params={params} {...props} />;
        case 'custom:askCodx':
            return <AskCodx params={params} {...props} />;
        case 'custom:progressComponent':
            return <CustomProgressRendererComponent params={params} {...props} />;
        case 'custom:customTypography':
            return <CustomTypography params={params.content} {...props} />;
        case 'custom:mapComponent':
            return <CodxMapComponent params={params} {...props} />;
        case 'custom:customAudience':
            return <CustomAudience params={params} {...props} />;
        case 'custom:dataScout':
            return <DataScout params={params} {...props} />;
        case 'custom:extraLoader':
            return <CodxExtraLoader params={params} {...props} />;
        case 'custom:diagnoseme':
            return <Diagnoseme params={params} {...props} />;
        case 'custom:diagnoseme-clone':
            return <LandingPageClone params={params} {...props} />;
        case 'custom:uploadImage':
            return <UploadImage params={params} {...props} />;
        case 'custom:searchProduct':
            return <ProductSearch params={params} {...props} />;
        default:
            return null;
    }
}
