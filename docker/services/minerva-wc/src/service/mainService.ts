import { Signal, batch, signal } from "@preact/signals";
import { IConsumer } from "../model/IConsumer";
import { ICopilotAppDetails, ICopilotInputConfig } from "../model/ICopilotAppDetails";
// import { setupSocketConn } from "../socket";
// import { Socket } from "socket.io-client";
import { fetchProcessor } from "../util/httpUtil";
import { MainServiceEvents } from "../model/Events";
import CustomEventTarget from "../util/customEventTarget";

export default class MainService {
    serverUrl = signal("");
    testServerUrl = signal("");
    consumerAccessKey = signal("");
    consumerData : Signal<IConsumer> = signal(null);
    userAuthSettings = signal({
        authToken: "",
        authTokenStore: "",
        authTokenStoreKey: ""
    });
    // socketConn: Signal<Socket> = signal(null);
    authGetter = signal(null);
    appId = signal(null);
    copilotAppId = signal(null);
    copilotAppDetails: Signal<ICopilotAppDetails> = signal(null)
    loadingCopilotAppDetails = signal(false);
    loadingConsumerDetails = signal(false)
    copilotAppDetailsLoaded = signal(false);
    copilotConsumerDetailsLoaded = signal(false);
    eventTarget: CustomEventTarget<typeof MainServiceEvents> = new CustomEventTarget()
    enableFileInput: Signal<Boolean> = signal(false)
    inputConfig: Signal<ICopilotInputConfig> = signal({max_files: 2, max_file_size: 25000, accepted_file_type: []})
    enableStoryBoarding: Signal<Boolean> = signal(false)

    async getAuthToken() {
        const { authToken, authTokenStore, authTokenStoreKey } = this.userAuthSettings.value;
        if (this.authGetter.value && typeof(this.authGetter.value) == 'function') {
            return await this.authGetter.value();
        }
        if (authToken) {
            return authToken;
        } else if (authTokenStore == 'localStorage') {
            return window.localStorage.getItem(authTokenStoreKey)
        } else if (authTokenStore == 'sessionStorage') {
            return window.sessionStorage.getItem(authTokenStoreKey)
        }
    }

    disconnectSocket() {
        // if (this.socketConn.value) {
        //     this.socketConn.value.disconnect()
        // }
    }

    async fetchConsumerData() {
        try {
            this.loadingConsumerDetails.value = true
            const res: IConsumer = await fetch(`${this.serverUrl.value}/admin/consumer-data?` + new URLSearchParams({
                    'access_key': this.consumerAccessKey.value,
                }),
            ).then(fetchProcessor);
            batch(() => {
                this.consumerData.value = res;
                this.appId.value = res.copilot_apps?.[0] || res.minerva_apps?.[0];
                this.copilotAppId.value = res.copilot_apps?.[0];
                this.copilotConsumerDetailsLoaded.value = true;
            })
            return res;
        } catch(err) {
            console.error("Error: Failed to load consumer. " + err);
            this.copilotConsumerDetailsLoaded.value = false;
        } finally {
            this.loadingConsumerDetails.value = false
        }
    }

    async getAppSkillsets() {
        try {
             const authToken = await this.getAuthToken()
             const res = await fetch(`${this.serverUrl.value}/copilot/app/${this.copilotAppId.value}/tool/list?` + new URLSearchParams({
                    'access_key': this.consumerAccessKey.value,
                }),
                {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                }
            ).then(fetchProcessor);

            //filter skillsets with input_elements type attachments
            this.enableFileInput.value = res.some(item =>
                item?.input_params?.input_elements?.some(element => element.type === 'attachments')
            );
            if(this.enableFileInput.value){
                let maxFiles = 0;
                let maxFileSize = 0;
                let acceptedFileTypesSet: Set<string> = new Set();
                res.forEach(item => {
                    if (item.input_params && item.input_params?.input_elements) {
                            item.input_params.input_elements?.forEach(element => {
                                if (element.type === "attachments" && element.params) {
                                    const { max_files, max_file_size, accept } = element.params;
                                    if (max_files > maxFiles) maxFiles = max_files;
                                    if (max_file_size> maxFileSize) maxFileSize = max_file_size;
                                    if (accept) {
                                        acceptedFileTypesSet = new Set([...acceptedFileTypesSet, ...accept]);
                                    }
                                }
                            });
                    }
                });

                const acceptedFileTypesArray = Array.from(acceptedFileTypesSet);
                this.inputConfig.value = {
                    max_files: maxFiles || this.inputConfig.value.max_files,
                    max_file_size: maxFileSize || this.inputConfig.value.max_file_size,
                    accepted_file_type: acceptedFileTypesArray.length ? acceptedFileTypesArray : this.inputConfig.value.accepted_file_type
                };

            }

            //filter skillsets with input_elements type storyboard
            this.enableStoryBoarding.value = res.some(item =>
                item?.input_params?.input_elements?.some(element => element.type === 'storyboard')
            );
        }catch(err) {
            console.log("errror",err)
        }
    }

    async createSocketConn() {
        // try {
        //     if (this.serverUrl.value) {
        //         const authToken = await this.getAuthToken();
        //         if (authToken) {
        //             this.disconnectSocket();
        //             this.socketConn.value = setupSocketConn(this.serverUrl.value, authToken, this.consumerAccessKey.value);
        //         }
        //     } else {
        //         return null;
        //     }
        // } catch(err) {
        //     console.error("Error: Failed to create socket connection. " + err);
        //     return null;
        // }
    }

    async loadCopilotAppDetails() {
        try {
            const authToken = await this.getAuthToken()
            this.loadingCopilotAppDetails.value = true
            const res: ICopilotAppDetails = await fetch(`${this.serverUrl.value}/copilot/app/${this.copilotAppId.value}?` + new URLSearchParams({
                    'access_key': this.consumerAccessKey.value,
                }),
                {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                }
            ).then(fetchProcessor);
            batch(() => {
                this.copilotAppDetails.value = res;
                this.copilotAppDetailsLoaded.value = true;
            })
            return res;
        } catch(err) {
            this.copilotAppDetailsLoaded.value = false;
            console.error("Error: Failed to load consumer. " + err);
        } finally {
            this.loadingCopilotAppDetails.value = false;
        }
    }
}