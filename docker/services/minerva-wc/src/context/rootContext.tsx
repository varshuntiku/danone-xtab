import { Context, createContext } from "preact";
import QueryService from "../service/queryService";
import MainService from "../service/mainService";
import CitationService from "../service/citationService";
import UtilService from "../service/utilService";
export const RootContext: Context<{
    [key:string]: any,
    mainService: MainService,
    queryService: QueryService,
    citationService: CitationService,
    utilService: UtilService
}> = createContext(null);
export default function RootContextProvider({children, value}) {
    return <RootContext.Provider value={value}>
       {children}
       </RootContext.Provider>
}