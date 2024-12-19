import moment from 'moment';

export default function DateRenderer({ params }) {
    if (params.value) {
        if (params.format) {
            return moment(new Date(params.value)).format(params.format);
        } else {
            return new Date(params.value).toString();
        }
    } else {
        return null;
    }
}
