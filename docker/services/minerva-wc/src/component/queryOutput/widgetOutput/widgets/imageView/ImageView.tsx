import {useState } from "preact/hooks"
import './imageView.scss'
import ImageRenderer from "../imageRenderer/ImageRenderer";
import OpenInNewIcon from "../../../../../svg/OpenInNewIcon";

// const privateImageUrlMapping = {}

export default function ImageView({ data, width = "", height = "" }) {

    const [imageList, setImageList] = useState<Array<any>>([...data])
    const [activeImage, setActiveImage] = useState(0)
    const [showErrorPlaceholder, setShowErrorPlaceholder] = useState(false)
    // const { queryService } = useContext(RootContext);
    // const imgRef = useRef<HTMLImageElement>()

    // useEffect(() => {
    //     data.forEach((item, i) => {
    //         setImageList(s => {
    //             s[i] = {
    //                 ...item,
    //                 url: item.url.startsWith('private:') ? privateImageUrlMapping[item.url] || null : item.url
    //             }
    //             return [...s];
    //         })
    //         if (item.url.startsWith('private:') && !privateImageUrlMapping[item.url]) {
    //             const imgUrl = item.url.replace("private:", "")
    //             queryService.fetchBlobSasUrl(imgUrl).then((response) => {
    //                 privateImageUrlMapping[item.url] = response;
    //                 setImageList(s => {
    //                     s[i]['url'] = response;
    //                     return [...s];
    //                 })
    //             }).catch(err => { })
    //         }
    //     })

    // }, [data])

    // const fullScreenImageHandler = () => {
    //     if (imgRef?.current) {
    //         imgRef?.current.requestFullscreen();
    //     }
    // }

    // const externalLinkHandler = () => {
    //     window.open(imageList[activeImage]?.source_link, "_blank")
    // }

    const handlePrevClick = () => {
        setActiveImage(activeImage - 1);
        setShowErrorPlaceholder(false)
    }

    const handleNextClick = () => {
        setActiveImage(activeImage + 1);
        setShowErrorPlaceholder(false)
    }

    return (
        <div className="MinervaImageViewContainer" style={{ width: width, height: height }}>
            {imageList[activeImage]?.source_link? (
                <div className="MinervaImageView-actionContainer">
                    <a href={imageList[activeImage]?.source_link} target="_blank" className="MinervaImageView-hyperlink">
                        Source Docs <OpenInNewIcon className="MinervaIconContrast"/>
                    </a>
                </div>
            ): null}
            <ImageRenderer data={imageList[activeImage]} showErrorPlaceholder={showErrorPlaceholder} onError={() => setShowErrorPlaceholder(true)}/>
            {imageList.length > 1 && <div className="MinervaImageContainer-action">
                <button className="MinervaButton-text-small" onClick={handlePrevClick} disabled={activeImage === 0}>Prev</button>
                <p>{activeImage + 1} / {imageList.length}</p>
                <button className="MinervaButton-text-small" onClick={handleNextClick} disabled={activeImage === imageList.length - 1}>Next</button>
            </div>}
        </div>
    )
}