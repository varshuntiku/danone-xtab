import he from 'he';
import { isArray, isObject, isString } from 'underscore';

export const decodeHtmlEntities = (data) => {
    let decoded_value = {};
    if (isArray(data)) {
        decoded_value = data.map((item) => {
            return decodeHtmlEntities(item);
        });
    } else if (isObject(data)) {
        for (let key in data) decoded_value[key] = decodeHtmlEntities(data[key]);
    } else if (isString(data)) decoded_value = he.decode(data);
    else decoded_value = data;
    return decoded_value;
};
