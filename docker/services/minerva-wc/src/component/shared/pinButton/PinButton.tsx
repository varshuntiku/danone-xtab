import { useContext, useEffect, useState } from "preact/hooks";
import "./pinButton.scss"
import { RootContext } from "../../../context/rootContext";
import PinOutlinedIcon from "../../../svg/PinOutlinedIcon";
import PinIcon from "../../../svg/PinIcon";
export default function PinButton({query_id, pinned}) {
    const [_pinned, setPinned] = useState(pinned);
    const {queryService, mainService} = useContext(RootContext);
    const handleClick = () => {
        const value = !_pinned;
        setPinned(value);
        queryService.updateQueryRecord(query_id, {
            pinned: value
        })
    };
    useEffect(() => {
        setPinned(pinned)
    }, [pinned]);

    if(!query_id || !mainService?.copilotAppId.value) {
        return null;
    }

    return (
        <div className="MinervaPinButton">
            <button
                title={pinned? "pinned": "click to pin"}
                className="MinervaIconButton"
                onClick={handleClick}
            >
                {_pinned? <PinIcon /> : <PinOutlinedIcon />}
            </button>
        </div>
    );
}
