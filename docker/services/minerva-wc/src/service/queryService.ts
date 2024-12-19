import { Signal, batch, signal } from "@preact/signals";
import { IQuery, StatusType } from "../model/Query";
// import sampleQuery from "../assets/query_response.json";
// import sampleQuery2 from "../assets/query_response2.json";
// import sampleQuery3 from "../assets/query_response3.json";
// import sampleQuery4 from "../assets/query_response4.json";
// import sampleQuery5 from "../assets/query_response5.json";
// import sampleQuery7 from "../assets/query_response7.json";
// import chatWindows from "../assets/convo_window.json";
// const sampleQuery = {status: StatusType.pending, id: 1, progress_message: "Agent has been asigned"};
// const sampleDatasourceQuery = {input: "what is the content of the file", status: StatusType.pending, id: 1, progress_message: "Agent has been assigned", datasource: [{name: "test.txt", datasource_type: "file", file_type: "text/plain"}, {name: "test2.txt", datasource_type: "file", file_type: "text/plain"}]};
import { nanoid } from "../util";
import MainService from "./mainService";
import { IConversationWindow } from "../model/ConversationWindow";
import { fetchProcessor } from "../util/httpUtil";
import { response_itr_line } from "../util/response";
import { QueryServiceEvents } from "../model/Events";
import CustomEventTarget from "../util/customEventTarget";

const privateUrlMapping = {}

export default class QueryService {
    queries: Signal<Array<Partial<IQuery>>> = signal([]);
    conversationWindowListLoaded = signal(false);
    conversationWindows: Signal<Array<IConversationWindow>> = signal([]);
    selectedWindowId = signal(0);
    next_offset = 0;
    total_count = signal(0);
    loadingConversation = signal(false);
    scrollToResponseId = signal(null);
    private mainService: MainService;
    skipConversationWindow = '';
    stopQueryFetch = signal(false);
    eventTarget: CustomEventTarget<typeof QueryServiceEvents> = new CustomEventTarget();
    extra_query_param = signal('');




    constructor(mainStore: MainService) {
        this.mainService = mainStore;
    }


    addQuery(query: Partial<IQuery>) {
        this.queries.value = [...this.queries.value, query]
    }

    updateQuery(id: any, updatedQuery: Partial<IQuery>) {
        const query = this.queries.value.find(el => el.query_trace_id == id || el.id == id);
        Object.assign(query, updatedQuery);
        this.queries.value = [...this.queries.value];
    }

    updateStopQueryFetch(value: boolean) {
        this.stopQueryFetch.value = value
    }

    setQueryProcessStatus(data) {
        const { query_trace_id, window_id, progress_message, output, progress_icon } = data;
        if (this.selectedWindowId.value === window_id || this.selectedWindowId.value === 0) {
            const q = this.queries.value.find((el) => el.id === query_trace_id);
            if (q) {
                q.progress_message = progress_message;
                q.progress_icon = progress_icon;
                if (output) {
                    q.output = { ...q.output, ...output };
                }
                this.queries.value = [...this.queries.value];
            }
        }
    }

    async makeQuery(query: string, inputMode: string, queryType?: string, payload?: Object, query_datasource?: Array<File>) {
        let id = nanoid();
        this.addQuery({
            id: id,
            input: query,
            status: StatusType.pending,
            query_trace_id: id,
            progress_message: "Analysing your query",
            datasource: query_datasource,
            request_type: queryType,
            request_payload: payload,
        })
        try {
            let controller = new AbortController();
            let controllerSignal = controller.signal;

            const authToken = await this.mainService.getAuthToken()
            // this.scrollToResponseId.value = id;
            this.eventTarget.dispatchEvent(QueryServiceEvents.JUMP_TO_QUERY, { detail: { id: id } })

            const copilotServerUrl = this.mainService.copilotAppDetails.value?.is_test ?
                this.mainService.testServerUrl.value || this.mainService.serverUrl.value : this.mainService.serverUrl.value

            let url = this.mainService.copilotAppId.value ? `${copilotServerUrl}/copilot/app/${this.mainService.appId.value}/query?`
                : `${this.mainService.serverUrl.value}/services/query/${this.mainService.appId.value}?`

            let formData;

            if (this.mainService.copilotAppId.value) {
                formData = new FormData()
                formData.append('user_query', query);
                formData.append('window_id', String(this.selectedWindowId.value));
                formData.append('query_trace_id', id);
                formData.append('query_type', queryType || '');
                formData.append('skip_conversation_window', this.skipConversationWindow);
                formData.append('input_mode', inputMode);
                formData.append('extra_query_param', this.extra_query_param.value);
                if(payload) {
                    formData.append('payload', JSON.stringify(payload));
                }
                query_datasource?.forEach((file) => {
                    formData.append(`query_datasource`, file);
                });
            }

            if (this.mainService.copilotAppId.value) {
                this.stopQueryFetch.value = true;
            }

            let requestHeaders = {
                'Authorization': 'Bearer ' + authToken
            }

            if(this.mainService.copilotAppId.value) {
                url = url + new URLSearchParams({
                    'access_key': this.mainService.consumerAccessKey.value
                   })
            } else {
               requestHeaders['Content-Type'] = 'application/json'
               url = url + new URLSearchParams({
                'user_query': query,
                'window_id': String(this.selectedWindowId.value),
                'query_trace_id': id,
                'query_type': queryType,
                'access_key': this.mainService.consumerAccessKey.value,
                'skip_conversation_window': this.skipConversationWindow,
                'input_mode': inputMode,
                'extra_query_param': this.extra_query_param.value
               })
            }

            const res = await fetch(url ,
                {
                    method: "POST",
                    headers: requestHeaders,
                    body: this.mainService.copilotAppId.value ? formData : JSON.stringify(payload),
                    signal: controllerSignal
                }
            )

            // Aborting the fetch request on stop event
            this.eventTarget.addEventListener( QueryServiceEvents.QUERY_INTERRUPTED, () => {

                controller.abort();  // Abort the fetch request

                const audioPlayer = <HTMLAudioElement>(document.getElementById("audio-player"));
                if (!audioPlayer.paused) {
                    audioPlayer.pause();
                    // audioPlayer.src = '';
                }
            });

            let responseJSON = null;
            try {
                for await (const chunk of response_itr_line(res)) {
                  if (chunk) {
                    responseJSON = JSON.parse(chunk);
                    this.updateQuery(id, {
                      ...responseJSON,
                      status: StatusType.streaming,
                      query_trace_id: id,
                    });
                    this.eventTarget.dispatchEvent(
                      QueryServiceEvents.QUERY_RESPONSE_STREAMING
                    );
                    // const lastChunk = responseJSON.completed_chunk
                    //   ? responseJSON.completed_chunk
                    //   : false;
                    if (responseJSON.progress_audio_message) {
                      this.renderVoice(
                        responseJSON.progress_audio_message,
                        '',
                        copilotServerUrl,
                        responseJSON.id,
                      );
                    }
                    id = responseJSON.id;
                  }
                }

                const audioPlayer = <HTMLAudioElement>(document.getElementById("audio-player"));

                if (audioPlayer.paused)  {
                    this.updateQuery(id, {
                        playing: false
                    });
                } else {
                    audioPlayer.addEventListener("ended", () => {
                        this.updateQuery(id, {
                            playing: false
                        });
                    });
                }




                // Update the selectedWindowId based on the response or previous value
                // this.previousWindowId = this.selectedWindowId.value;
                // this.selectedWindowId.value = responseJSON?.window_id || this.previousWindowId;

                // Load the conversation window list if no window ID is available (only applicable for voice mode)
                if (!this.selectedWindowId.value) {
                    this.loadConversationWindowList()
                }
                this.selectedWindowId.value = responseJSON?.window_id || 0;

                this.updateQuery(id, { status: StatusType.resolved });


            } catch (err) {
                console.error(err)
                //TODO: add error handling
                if (controllerSignal.aborted) {

                    this.updateQuery(id, { status: StatusType.resolved, interrupted: true, progress_message: "", playing: false });

                } else {
                    throw err
                }
            } finally {
                this.eventTarget.dispatchEvent(QueryServiceEvents.QUERY_RESPONSE_STREAMING_END);
            }
        } catch (error) {
            console.error(error);
            this.updateQuery(id, { status: StatusType.rejected, playing: false });
        } finally {
            this.stopQueryFetch.value = false
        }
    }

    async renderVoice(
        textToRender: string,
        restructureText: string,
        copilotServerUrl: string,
        id: number
      ) {
        const audioPlayer = <HTMLAudioElement>(
            document.getElementById("audio-player")
          );

        audioPlayer.addEventListener("play", () => {
          this.updateQuery(id, { playing: true });
        } );

        // // Update playing state when audio finishes
        // if (lastChunk) {
        //   audioPlayer.addEventListener("ended", () => {
        //     this.updateQuery(id, {
        //       playing: false,
        //       status: StatusType.resolved, // this could be removed. need to test
        //     });
        //   });
        // }

        const authToken = await this.mainService.getAuthToken()

        let url = this.mainService.copilotAppId.value
          ? `${copilotServerUrl}/copilot/app/${
              this.mainService.appId.value
            }/query_audio?text_to_audio=${encodeURIComponent(
              textToRender
            )}&restructure_text=${encodeURIComponent(restructureText)}&uri_token=${authToken}`
          : null;

        audioPlayer.src = url; // Update audio source with new audio URL

        return new Promise((resolve) => {
          audioPlayer.onended = resolve; // Resolve when audio finishes
          audioPlayer.play(); // Play the audio
        });
      }

    async updateQueryRecord(id: any, updatedQuery: Partial<IQuery>) {
        try {
            if (!this.mainService.copilotAppId.value) {
                return;
            }
            const authToken = await this.mainService.getAuthToken()

            const url = `${this.mainService.serverUrl.value}/copilot/conversation/${id}?`

            const res: IQuery = await fetch(url + new URLSearchParams({
                'access_key': this.mainService.consumerAccessKey.value
            }),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + authToken
                    },
                    body: JSON.stringify(updatedQuery)
                }
            ).then(fetchProcessor);
            batch(() => {
                this.updateQuery(id, { ...res });
            })
            return res;
        } catch (error) {
            //** error */
        }
    }

    async loadConversation() {
        if (!this.selectedWindowId.value) {
            return;
        }


        try {



            const authToken = await this.mainService.getAuthToken()
            this.loadingConversation.value = true;
            const url = this.mainService.copilotAppId.value ? `${this.mainService.serverUrl.value}/copilot/app/${this.mainService.appId.value}/conversations?`
                : `${this.mainService.serverUrl.value}/services/conversations/${this.mainService.appId.value}?`
            const response = await fetch(url + new URLSearchParams({
                window_id: this.selectedWindowId.value.toString(),
                //To fetch all queries in the Conversation Window
                // query_limit: '10',
                query_offset: this.next_offset.toString(),
                access_key: this.mainService.consumerAccessKey.value
            }),
                {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                }).then(fetchProcessor);
            batch(() => {
                this.queries.value = [...response.list, ...this.queries.value];
                this.next_offset = response.next_offset;
                this.total_count.value = response.total_count;
                this.loadingConversation.value = false;
                this.eventTarget.dispatchEvent(QueryServiceEvents.JUMP_TO_QUERY, { detail: { id: response.list.at(-1)?.id } })
            })
        } catch (err) {
            this.loadingConversation.value = false;
        }
    };

    async loadConversationWindowList() {
        try {
            const authToken = await this.mainService.getAuthToken()
            if (!authToken) {
                return;
            }
            const url = this.mainService.copilotAppId.value ? `${this.mainService.serverUrl.value}/copilot/app/${this.mainService.appId.value}/conversation-windows?`
                : `${this.mainService.serverUrl.value}/services/conversation-window/${this.mainService.appId.value}?`
            const response = await fetch(url + new URLSearchParams({
                access_key: this.mainService.consumerAccessKey.value
            }),
                {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                }
            ).then(fetchProcessor);
            batch(() => {
                this.conversationWindows.value = <any>response;
                this.conversationWindowListLoaded.value = true;
            })


        } catch (err) {
            batch(() => {
                this.conversationWindowListLoaded.value = false;
                this.conversationWindows.value = [];
            })
        }
    }

    async loadLatestConversation() {
        this.selectedWindowId.value = this.conversationWindows.value?.[0]?.id || 0;
        await this.loadConversation();
    }

    clearChatWindow() {
        batch(() => {
            this.queries.value = [];
            this.next_offset = 0;
            this.total_count.value = 0;
            this.scrollToResponseId.value = null;
        })
    }

    startNewChatWindow() {
        batch(() => {
            this.clearChatWindow()
            this.selectedWindowId.value = 0;
        })
    }

    changeChatWindow(windowId: number) {
        batch(() => {
            this.clearChatWindow()
            this.selectedWindowId.value = windowId;
        })
        this.loadConversation()
    }

    async updateConversationWindow(windowId: number, data: Partial<Omit<IConversationWindow, "id">>) {
        try {
            const authToken = await this.mainService.getAuthToken();
            const url = this.mainService.copilotAppId.value ? `${this.mainService.serverUrl.value}/copilot/conversation-window/${windowId}?`
                : `${this.mainService.serverUrl.value}/services/conversation-window/${windowId}?`
            const response = await fetch(url + new URLSearchParams({
                access_key: this.mainService.consumerAccessKey.value
            }),
                {
                    method: "PUT",
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            ).then(fetchProcessor);
            const obj = this.conversationWindows.value.find(el => el.id === windowId);
            Object.assign(obj, response.data);
            this.conversationWindows.value = [...this.conversationWindows.value];
            return response;
        } catch (err) { }
    }

    async deleteConversationWindow(windowId: number) {
        try {
            const newList = this.conversationWindows.value.filter(el => el.id != windowId);
            this.conversationWindows.value = newList;
            if (this.selectedWindowId.value === windowId) {
                this.startNewChatWindow()
            }
            const authToken = await this.mainService.getAuthToken();
            const url = this.mainService.copilotAppId.value ? `${this.mainService.serverUrl.value}/copilot/conversation-window/${windowId}?`
                : `${this.mainService.serverUrl.value}/services/conversation-window/${windowId}?`
            const response = await fetch(url + new URLSearchParams({
                access_key: this.mainService.consumerAccessKey.value
            }),
                {
                    method: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    },
                }
            ).then(fetchProcessor);
            return response
        } catch (err) { }
    }

    async fetchBlobSasUrl(imageUrl: string) {
        try {
            const authToken = await this.mainService.getAuthToken()
            const response = await fetch(`${this.mainService.serverUrl.value}/services/get_blob_sas_url?` + new URLSearchParams({
                blob_url: imageUrl,
                access_key: this.mainService.consumerAccessKey.value
            }),
                {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                }).then(fetchProcessor);
            return response
        } catch (err) {
            throw Error('Unable to fetch Sas URL: ' + err.message)
        }
    }

    async getPublicURL(privateURL: string) {
        if(privateURL?.startsWith('private:') && !privateUrlMapping[privateURL]){
            const urlParam = privateURL.replace("private:", "")
            const response = await this.fetchBlobSasUrl(urlParam);
            privateUrlMapping[privateURL] = response;
            return response
        } else {
            const finalUrl = privateURL?.startsWith('private:') ? privateUrlMapping[privateURL] : privateURL
            return finalUrl;
        }
    }
}



