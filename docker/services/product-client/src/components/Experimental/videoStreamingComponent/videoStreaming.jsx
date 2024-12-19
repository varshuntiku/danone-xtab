import React, { useState } from 'react';

/**
 *
 * @summary A Very basic Video Streaming Component that can render Live stream feed of images. Cant run Video. Just runs multipart images
 */
const VideoStreaming = ({ ...props }) => {
    const [liveFeedUrl] = useState(props.params.source);
    const { params } = props;
    // let video_url = `${socket_url}/app/${params.app_id}/live-stream/${params.screen_name}`;
    const baseURL =
        import.meta.env['REACT_APP_ENABLE_FASTAPI'] === 'true'
            ? import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']
            : import.meta.env['REACT_APP_BACKEND_API'];
    let backendUrl = `${baseURL}/live-stream?live_feed=${encodeURIComponent(liveFeedUrl)}`;

    return (
        <div
            style={{
                borderStyle: params.streambox_border || 'none',
                width: params.streambox_width || '100%',
                height: params.streambox_height || '70vh'
            }}
        >
            <img
                src={backendUrl}
                alt={
                    params.broken_text ||
                    'We were unable to run the live stream. Please check with the development team.'
                }
                style={{
                    width: params.stream_width || '100%',
                    height: params.stream_height || '70vh'
                }}
            />
        </div>
    );
};

export default VideoStreaming;
