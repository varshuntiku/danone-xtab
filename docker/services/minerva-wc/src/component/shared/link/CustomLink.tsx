import { useContext, useEffect, useState } from "preact/hooks"
import { RootContext } from "../../../context/rootContext";
import { HTMLAttributes } from "preact/compat";

const privateUrlMapping = {}

type AnchorPropsType = {
    children?: any,
    url?: string,
}

export default function CustomLink({children, url, ...props}: AnchorPropsType & HTMLAttributes<HTMLAnchorElement>) {

    const [currentUrl, setCurrentUrl] = useState("")
    const { queryService } = useContext(RootContext);

    useEffect(() => {
        (async () => {
            const finalURL = await queryService.getPublicURL(url);
            setCurrentUrl(finalURL);
        })()
    }, [url]);

    return (
        <a href={currentUrl} {...props}>
            {children}
        </a>
    )
}