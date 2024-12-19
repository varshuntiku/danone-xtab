import { axiosClient } from './httpClient';

import * as _ from 'underscore';

export async function getchatgptText(params) {
    try {
        let response_messages = '#Start of charts, insights, tables and metrics\n';
        _.each(params.items, function (data_item) {
            if (data_item.data && data_item.data.value) {
                data_item = JSON.parse(JSON.stringify(data_item.data.value));
                if (data_item.data && data_item.layout) {
                    if (data_item.layout.template) {
                        delete data_item.layout.template;
                    }

                    if (data_item.layout.margin) {
                        delete data_item.layout.margin;
                    }

                    data_item.data = _.map(data_item.data, function (graph_item) {
                        delete graph_item.hoverinfo;

                        return graph_item;
                    });
                    response_messages +=
                        '\t#start of chart ' + JSON.stringify(data_item) + '#end of chart\n';
                } else if (data_item?.table_data && data_item?.table_headers) {
                    response_messages +=
                        '\t#start of table ' + JSON.stringify(data_item) + '#end of table\n';
                } else if (data_item?.tableProps) {
                    response_messages +=
                        '\t#start of grid table ' +
                        JSON.stringify(data_item) +
                        '#end of grid table\n';
                } else if (data_item?.isExpandable && data_item?.columns) {
                    response_messages +=
                        '\t#start of expandable table ' +
                        JSON.stringify(data_item) +
                        '#end of expandable table\n';
                } else if (data_item.insight_data) {
                    let insights_response = _.map(data_item.insight_data, function (insight_item) {
                        return (
                            '\t\t#start of insight ' +
                            (insight_item.header ? insight_item.header : '') +
                            ' ' +
                            insight_item.label +
                            ' is/are ' +
                            insight_item.value +
                            '#end of insight'
                        );
                    }).join('.\n');
                    response_messages +=
                        '\t#start of groups of insights ' +
                        data_item.insight_label +
                        ':\n' +
                        insights_response +
                        '\n\t#end of groups of insights\n';
                }
            } else {
                response_messages +=
                    '\t#start of metric ' + JSON.stringify(data_item) + '#end of metric\n';
            }
        });

        response_messages += '#end of charts, insights, tables and metrics\n';

        response_messages +=
            params.config && params.config.context && params.config.persona !== ''
                ? 'Context: ' + params.config.context + '\n'
                : '';
        response_messages +=
            params.config && params.config.persona && params.config.persona !== ''
                ? 'Persona: ' + params.config.persona + '\n'
                : '';
        response_messages +=
            params.config && params.config.instructions && params.config.instructions !== ''
                ? 'Instructions: ' + params.config.instructions + '\n'
                : '';
        response_messages +=
            params.config && params.config.prompt
                ? params.config.prompt
                : 'Extract summary, key insights and recommended actions from the charts, insights and metrics provided.';

        const payload = {
            prompt: response_messages,
            max_tokens: params.config && params.config.max_tokens ? params.config.max_tokens : 512,
            temperature:
                params.config && params.config.temperature ? params.config.temperature : 0.3,
            frequency_penalty:
                params.config && params.config.frequency_penalty
                    ? params.config.frequency_penalty
                    : 0,
            presence_penalty:
                params.config && params.config.presence_penalty
                    ? params.config.presence_penalty
                    : 0,
            top_p: params.config && params.config.top_p ? params.config.top_p : 1,
            best_of: params.config && params.config.best_of ? params.config.best_of : 1
            // model_name: (params.config && params.config.model_name) || 'Azure OpenAI'
        };
        const response = await axiosClient.post(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/generate-ai-insight',
            { ...payload }
        );
        if (response.data !== 'error') {
            params.callback(response.data);
        } else {
            params.failureCallback();
        }
        return true;
    } catch (error) {
        params.failureCallback(error);
        //TO DO
        // handle errors
        // throw new Error(error);
    }
}
