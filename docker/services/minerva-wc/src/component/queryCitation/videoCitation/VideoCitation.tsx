import { useContext, useEffect, useRef, useState } from "preact/hooks";
import "./videoCitation.scss";
import { RootContext } from "../../../context/rootContext";

interface VideoCitationData {
    title: string,
    src: string,
    rangeStart: number;
    rangeEnd: number;
    desc: string;
}

interface VideoCitationProps {
    data: VideoCitationData;
}

export default function VideoCitation( { data }: VideoCitationProps ) {
    const videoRef = useRef( null );
    const { queryService } = useContext( RootContext );
    const { mainService } = useContext( RootContext );
    const dataArray = Array.isArray( data ) ? data : [data];
    const [title, setTitle] = useState( dataArray[0].title );
    const [startTime, setStartTime] = useState( dataArray[0].rangeStart );
    const [srcUrl, setSrcUrl] = useState( "" );

    useEffect( () => {
        const fetchAuthToken = async () => {
            const blob_url = await queryService.getPublicURL( dataArray[0].src );
            const authToken = await mainService.getAuthToken();

            const initialSrcUrl = `${mainService.serverUrl.value}/copilot/video/?src_url=${blob_url}&start_time=${startTime}&uri_token=${authToken}`;
            setSrcUrl( initialSrcUrl );
        };

        fetchAuthToken();
    }, [dataArray, mainService] );

    const handleRangeClick = async ( start ) => {
        const selectedRange = dataArray.find( ( { rangeStart } ) => rangeStart === start );
        const selectedTitle = selectedRange ? selectedRange.title : null;
        const blob_url = await queryService.getPublicURL( selectedRange.src );

        if ( srcUrl.includes( blob_url ) ) {
            videoRef.current.currentTime = start;
            setStartTime( start );
            videoRef.current.play();
        } else {
            const authToken = await mainService.getAuthToken();
            const newSrcUrl = `${mainService.serverUrl.value}/copilot/video/?src_url=${blob_url}&start_time=${start}&uri_token=${authToken}`;
            setSrcUrl( newSrcUrl );
            setStartTime( start );
            setTitle( selectedTitle )
        }
    };

    const formatTime = ( seconds ) => {
        const minutes = Math.floor( seconds / 60 ).toString().padStart( 2, '0' );
        const remainingSeconds = ( seconds % 60 ).toString().padStart( 2, '0' );
        return `${minutes}:${remainingSeconds}`;
    };


    useEffect( () => {
        const videoElement = videoRef.current;

        const handleMetadataLoaded = () => {
            if ( videoElement ) {
                videoElement.currentTime = startTime;
                videoElement.play();
            }
        };

        const handleTimeUpdate = () => {
            const currentRange = dataArray.find( ( { rangeStart } ) => rangeStart === startTime );

            if ( currentRange && videoElement.currentTime >= currentRange.rangeEnd ) {
                videoElement.pause();
                videoElement.removeEventListener( "timeupdate", handleTimeUpdate );
            }
        };

        videoElement.addEventListener( "loadedmetadata", handleMetadataLoaded );
        videoElement.addEventListener( "timeupdate", handleTimeUpdate );

        return () => {
            videoElement.removeEventListener( "loadedmetadata", handleMetadataLoaded );
            videoElement.removeEventListener( "timeupdate", handleTimeUpdate );
        };
    }, [srcUrl, startTime] );

    return (
        <div className="MinervaVideoCitation">
            <video
                ref={videoRef}
                controls
                autoPlay
                src={srcUrl}
                preload="metadata"
            />
            <div className="MinervaVideoCitation-video-name"> {title} </div>
            <div className="MinervaVideoCitation-container">
                <div className="MinervaVideoCitation-title">Citation Time Frame</div>

                <div className="MinervaVideoCitation-ranges">
                    {dataArray.map( ( { rangeStart, rangeEnd, desc }, index ) => (
                        <div
                            key={index}
                            className="VideoCitationRange"
                            onClick={() => handleRangeClick( rangeStart )}
                        >
                            {formatTime( rangeStart )} - {formatTime( rangeEnd )} : <span>{desc} </span>
                        </div>
                    ) )}
                </div>
            </div>
        </div>
    );
}
