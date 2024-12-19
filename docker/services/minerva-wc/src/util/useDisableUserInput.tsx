import { useState, useContext, useEffect } from "preact/hooks";
import { RootContext } from "../context/rootContext";
import { QueryItemContext } from "../context/queryItemContext";

const useDisableUserInput = () => {

    const { queryService } = useContext(RootContext);
    const { query } = useContext(QueryItemContext);

    const [isDisabled, setIsDisabled] = useState(() => {
        const queries = queryService.queries.value;
        if (query.id !== queries[queries.length - 1]?.id) {
            return true;
        } else {
            return false;
        }
    })

    useEffect(() => {
        const queries = queryService.queries.value;
        if (query.id !== queries[queries.length - 1]?.id) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [queryService.queries.value, query]);

    return isDisabled;
}

export default useDisableUserInput;