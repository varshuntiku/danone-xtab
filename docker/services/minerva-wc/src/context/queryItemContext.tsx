import { Context, createContext } from "preact";
import { IQuery } from "../model/Query";
type QueryItemContextType = {
    query: Partial<IQuery>,
    citationEnabled: boolean
}
export const QueryItemContext: Context<QueryItemContextType> = createContext(null);

export default function QueryItemContextProvider({children, value}: {children: any, value: QueryItemContextType}) {
    return <QueryItemContext.Provider value={value}>
       {children}
       </QueryItemContext.Provider>
}