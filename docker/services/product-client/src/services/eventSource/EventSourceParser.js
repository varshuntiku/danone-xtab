/*
A typical server sent event data is of the format: [field_name]: [message]\n\n, where \n\n denotes end of event
FIELD NAME VALUES: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#fields
STEPS
1. Read the stram buffer
2. Convert to chunk
3. Combine the chunk (A single message could be broke down into many)
4. Convert to string
5. Identify the event type
6: Take the message
7: Call onMessage function (Format: {data: string, event: string, id: string, retry: boolean})
*/

const CHARS = ':\n';
const CASES = {
    COLON: CHARS.charCodeAt(0),
    NEW_LINE: CHARS.charCodeAt(1)
};
const FIELDS = {
    DATA: 'data',
    EVENT: 'event',
    ID: 'id',
    RETRY: 'retry'
};

function EventSourceParser(onMessage, onId, onRetry) {
    let array; // Used to store stream array
    let position = -1; // Used to read the array
    let fieldPosition = -1; // Used to identify field names(data, event, id, retry)
    let message;

    const resetMessage = () => {
        message = {
            data: '',
            id: '',
            event: '',
            retry: undefined
        };
    };

    this.processStream = async (stream) => {
        const reader = stream.getReader();
        let value;
        while (!({ value } = await reader.read()).done) {
            processArray(value);
        }
    };

    const processArray = (value) => {
        if (!array) {
            array = value;
            position = 0;
            fieldPosition = -1;
        } else {
            array = mergeArray(array, value);
        }

        const length = array.length;
        let start = 0;
        while (position < length) {
            const value = array[position];

            switch (value) {
                case CASES.NEW_LINE: {
                    processLine(start, position, fieldPosition);
                    fieldPosition = -1;
                    start = position + 1;
                    break;
                }
                case CASES.COLON: {
                    if (fieldPosition === -1) {
                        fieldPosition = position;
                    }
                    break;
                }
            }
            position++;
        }
        if (start == length) {
            array = null;
        } else if (start !== -1) {
            // Handle the case where \n\n is not provided
            // The start will never reach the end of the array so taking remaining to next step
            array = array.subarray(start);
            if (fieldPosition !== -1) {
                fieldPosition = position - fieldPosition + 1;
            }
            position = position - start; // Avoid processing already processed data
        }
    };

    const processLine = (start, end, fieldPosition) => {
        if (end - start === 0) {
            onMessage(message);
            resetMessage();
        } else if (fieldPosition >= start) {
            const text = new TextDecoder('utf-8').decode(array);
            const field = text.substring(start, fieldPosition);
            const messagePosition =
                text[fieldPosition + 1] === ' ' ? fieldPosition + 2 : fieldPosition + 1;
            const _message = text.substring(messagePosition, end);
            switch (field) {
                case FIELDS.DATA: {
                    message.data = message.data ? `${message.data}\n${_message}` : _message;
                    break;
                }
                case FIELDS.EVENT: {
                    message.event = _message;
                    break;
                }
                case FIELDS.ID: {
                    message.id = _message;
                    onId(_message);
                    break;
                }
                case FIELDS.RETRY: {
                    const id = parseInt(_message, 10);
                    if (!isNaN(id)) {
                        message.retry = id;
                        onRetry(_message);
                    }
                    break;
                }
            }
        }
    };

    const mergeArray = (x, y) => {
        const newArray = new Uint8Array(x.length + y.length);
        newArray.set(x);
        newArray.set(y, x.length);
        return newArray;
    };

    resetMessage();
}

export default EventSourceParser;
