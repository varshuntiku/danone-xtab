import register from 'preact-custom-element';
import MinervaWC from './MinervaWC';
import { cleanFactory } from './service/useFactory';
register(MinervaWC, 'minerva-wc', [
    'server_url',
    'test_server_url',
    'app_id',
    'copilot_app_id',
    'consumer_access_key',
    'auth_token',
    'auth_token_store',
    'auth_token_store_key',
    'theme_values',
    'auth_token_getter',
    'hide_trigger_button',
    'open_popper',
    'load_from_cache',
    'external_open_in_new',
    'external_open_in_new_title',
    'external_go_back',
    'external_go_back_title',
    'suppress_fullscreen_toggler',
    'variant',
    'trigger_button_variant',
    'minerva_alias',
    'empty_state_message',
    'input_placeholder',
    'minerva_version',
    'empty_state_message_greet',
    "extra_query_param",
    'empty_state_message_desc',
    'init_with_new_window',
    'skip_loading_plotly',
    'hide_sideworkspace'
], { shadow: false });

declare global {
    interface Window {
        Minerva: {
            clean: (consumer_access_key?: string) => void
        };
    }
}

window.Minerva = {
    clean: cleanFactory
}