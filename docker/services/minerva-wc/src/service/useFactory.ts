import CitationService from "./citationService";
import MainService from "./mainService";
import QueryService from "./queryService";
import UtilService from "./utilService";

export let memory: {[key: string]: any} = {}
export function useFactory(key: string, loadFromCache: boolean): {mainService: MainService, queryService: QueryService, citationService: CitationService, utilService: UtilService} {
    if (loadFromCache) {
        let data = memory[key];
        if (data) {
            return data;
        } else {
            data = getFreshData()
            memory[key] = data;
            return data;
        }
    } else {
        return getFreshData();
    }
}

function getFreshData() {
    const mainService = new MainService();
    const queryService = new QueryService(mainService);
    const citationService = new CitationService(mainService);
    const utilService = new UtilService(queryService);
    return {mainService, queryService, citationService, utilService}
}

export function cleanFactory(accessKey?: string) {
    if (accessKey) {
        delete memory[accessKey];
    } else {
        memory = {};
    }
}