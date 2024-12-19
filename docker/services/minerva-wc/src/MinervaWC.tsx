import { useEffect, useState } from "preact/hooks";
import MinervaPopper from "./component/minervaPopper/MinervaPopper";
import ThemeProvider from "./theme/ThemeContext";
import "./style.scss";
import { createPortal } from "preact/compat";
import RootContextProvider from "./context/rootContext";
import { useFactory } from "./service/useFactory";
import MinervaFullScreen from "./component/minervaFullScreen/MinervaFullScreen";
import { batch } from "@preact/signals";
import MinervaEmbedded from "./component/minervaPopper/MinervaEmbedded";

const getThemeValue = (v) => {
    try {
        return JSON.parse(v);
    } catch (err) {
        console.error("Error: wrong themeValues");
        return {}
    }
}

export default function MinervaWC({ app_id = "", copilot_app_id = "", load_from_cache = false, variant = "", auth_token_getter = "", auth_token = "", auth_token_store = "", auth_token_store_key = "", server_url = process.env.SERVER_URL || "", test_server_url= process.env.TEST_SERVER_URL || "", consumer_access_key = "", skip_loading_plotly = "", theme_values = '{}', init_with_new_window = false, skip_conversation_window = '', hide_sideworkspace=false, extra_query_param='', ...props }) {
    const [themeValues, setThemeValue] = useState(() => getThemeValue(theme_values));
    const [key, setKey] = useState(consumer_access_key || copilot_app_id || app_id);
    const [{ mainService, queryService, citationService, utilService }, setServices] = useState(useFactory(key, load_from_cache));
    useEffect( () => {
        setKey((k) => {
            const new_key = consumer_access_key || copilot_app_id || app_id;
            if (k != new_key) {
                const services = useFactory(new_key, load_from_cache);
                setServices(services);
                return new_key
            }
            return k;
        })
    }, [consumer_access_key, copilot_app_id, app_id]);


    useEffect(() => {
        batch(() => {
            mainService.appId.value = copilot_app_id || app_id;
            mainService.copilotAppId.value = copilot_app_id
        })
    }, [mainService, app_id, copilot_app_id]);

    useEffect(() => {
        mainService.serverUrl.value = server_url;
    }, [mainService, server_url]);

    useEffect(() => {
        mainService.testServerUrl.value = test_server_url;
    }, [mainService, test_server_url]);

    useEffect(() => {
        mainService.consumerAccessKey.value = consumer_access_key;
    }, [mainService, consumer_access_key]);

    useEffect(() => {
        mainService.userAuthSettings.value = {
            authToken: auth_token,
            authTokenStore: auth_token_store,
            authTokenStoreKey: auth_token_store_key,
        }
    }, [mainService, auth_token, auth_token_store, auth_token_store_key]);

    useEffect(() => {
        mainService.authGetter.value = auth_token_getter
    }, [mainService, auth_token_getter])

    useEffect(() => {
        setThemeValue(getThemeValue(theme_values));
    }, [theme_values]);

    // useEffect(() => {
    //     return () => {
    //         mainService.disconnectSocket()
    //     }
    // }, [mainService]);

    useEffect(() => {
        if (consumer_access_key && server_url) {
            if (!mainService.copilotConsumerDetailsLoaded.value) {
                mainService.fetchConsumerData();
            }
        }
    }, [mainService, consumer_access_key, server_url]);

    // useEffect(() => {
    //     if (server_url && (auth_token || (auth_token_store && auth_token_store_key) || auth_token_getter)) {
    //         mainService.createSocketConn();
    //     }
    //     return () => {
    //         mainService.disconnectSocket();
    //     }
    // }, [mainService, server_url, auth_token, auth_token_store, auth_token_store_key, auth_token_getter]);

    useEffect(() => {
        try {
            (async () => {
                if (mainService.appId.value && (auth_token || (auth_token_store && auth_token_store_key) || auth_token_getter)) {
                    if (!queryService.conversationWindowListLoaded.value) {
                        await queryService.loadConversationWindowList();
                        if (!init_with_new_window) {
                            if (!mainService.consumerData.value?.features?.rootProps?.init_with_new_window) {
                                await queryService.loadLatestConversation();
                            }
                        }
                    }
                }
            })()
        } catch (err) { }
    }, [mainService, queryService, mainService.appId.value, auth_token, auth_token_store, auth_token_store_key, auth_token_getter]);

    useEffect(() => {
        try {
            (async () => {
                if (mainService.copilotAppId.value && (auth_token || (auth_token_store && auth_token_store_key) || auth_token_getter)) {
                    if (!mainService.copilotAppDetailsLoaded.value) {
                        await mainService.loadCopilotAppDetails();
                        await mainService.getAppSkillsets();
                    }
                }
            })()
        } catch (err) { }
    }, [mainService, mainService.copilotAppId.value, auth_token, auth_token_store, auth_token_store_key, auth_token_getter])

    useEffect(() => {
        queryService.skipConversationWindow = skip_conversation_window
    }, [queryService, skip_conversation_window])

    useEffect(() => {
        queryService.extra_query_param.value = extra_query_param
    }, [queryService, extra_query_param])

    return <RootContextProvider value={{
        minerva_alias: mainService.copilotAppDetails.value?.config?.identity,
        minerva_avatar_url: mainService.copilotAppDetails.value?.config?.avatar_url,
        suggested_queries: mainService.copilotAppDetails.value?.config?.suggested_queries,
        empty_state_message_desc: mainService.copilotAppDetails.value?.config?.empty_state_message_desc,
        ...mainService.consumerData.value?.features?.rootProps,
        auth_token_getter,
        auth_token,
        auth_token_store,
        auth_token_store_key,
        server_url,
        consumer_access_key,
        skip_loading_plotly,
        app_id,
        variant,
        ...props,
        mainService,
        queryService,
        citationService,
        utilService,
        hide_sideworkspace
    }}>
        <ThemeProvider themeValues={themeValues}>
          {skip_loading_plotly
            ? null
            : createPortal(
                <script
                  src="https://cdn.plot.ly/plotly-latest.min.js"
                  type="text/javascript"
                  id="minerva-plotly"
                ></script>,
                document.head
              )}
          {variant == "fullscreen" ? <MinervaFullScreen /> : null}
          {variant == "fullscreen-mini" ? <MinervaEmbedded/> : null}
          {["fullscreen", "fullscreen-mini", "fullheight"].includes(
            variant
          ) ? null : (
            <MinervaPopper />
          )}
        </ThemeProvider>
      </RootContextProvider>
}