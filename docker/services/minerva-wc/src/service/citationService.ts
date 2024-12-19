import { Signal, signal } from "@preact/signals";
import MainService from "./mainService";
import { ICitationViewModel } from "../model/ICitation";
export default class CitationService {
    activeCitationDetails: Signal<ICitationViewModel> = signal(null);
    activeQueryId: Signal<number| string> = signal(null);
    private mainService: MainService;

    constructor(mainStore: MainService) {
        this.mainService = mainStore;
    }

    setActivateCitation(queryId: number|string, data: ICitationViewModel) {
        this.activeQueryId.value = queryId;
        this.activeCitationDetails.value = data;
    }

}