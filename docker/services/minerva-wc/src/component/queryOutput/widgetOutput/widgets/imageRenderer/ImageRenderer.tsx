import { useContext, useEffect, useRef, useState } from "preact/hooks"
import './imageRenderer.scss'
import { RootContext } from "../../../../../context/rootContext";
import { Fragment } from "preact/jsx-runtime";
import FullSreenIcon from "../../../../../svg/FullScreenICon";
import HideImageIcon from "../../../../../svg/HideImageIcon";

const privateImageUrlMapping = {}

export default function ImageRenderer({ data, width = "", height = "", showErrorPlaceholder = false, whiteBg = false, ...props }) {

    const [imageData, setImageData] = useState<object>({})
    const { queryService } = useContext(RootContext);

    const imgRef = useRef<HTMLImageElement>()

    useEffect(() => {
        const preparedImageData = {
            ...data,
            "url": data?.url?.startsWith('private:') ? privateImageUrlMapping[data?.url] || null : data.url
        }
        const imgUrl = data['url']
        if (imgUrl?.startsWith('private:') && !privateImageUrlMapping[imgUrl]) {
            const url = imgUrl.replace("private:", "")
            queryService.fetchBlobSasUrl(url).then((response) => {
                privateImageUrlMapping[imgUrl] = response;
                preparedImageData['url'] = response
                setImageData(preparedImageData)
            }).catch(err => { })
        } else {
            setImageData(preparedImageData)
        }

    }, [data])

    const fullScreenImageHandler = () => {
        if (imgRef?.current) {
            imgRef?.current.requestFullscreen();
        }
    }

    return (
        <div className="MinervaImageRendererContainer" style={{ width: width, height: height }}>
            <div className="MinervaImage-wrapper">
                {imageData["url"] && !showErrorPlaceholder ?
                    <Fragment>
                        <img src={imageData["url"]} alt={imageData["caption"]}
                            className='MinervaImage-img' ref={imgRef}
                            style={{"--img-bg": whiteBg? "#fff" : "transparent"}}
                            onError={() => props.onError()}/>
                        {!props.hideFullScreenButton && <button className="MinervaImageRenderer-fullScreen MinervaIconButton" onClick={fullScreenImageHandler} title="Open in full screen">
                            <FullSreenIcon/>
                        </button>}
                    </Fragment> :
                    <div className="MinervaImage-img MinervaImage-hide-align">
                       <HideImageIcon className="MinervaIcon"/>
                    </div>
                }
            </div>
            {imageData["caption"] ? <p className="MinervaImageRenderer-caption">{imageData["caption"]}</p> : null}
        </div>




    )
}