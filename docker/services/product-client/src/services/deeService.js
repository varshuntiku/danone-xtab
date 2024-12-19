const deeObj = {
    status: true,
    count: 0,
    message: "It's working"
};

export const modifyDEEStatus = (statusCode, message = '') => {
    if ([401, 404, 422, 500, 502, 504].includes(statusCode)) {
        deeObj['status'] = false;
        deeObj['count'] += 1;
        deeObj['message'] = message;
        return;
    } else {
        deeObj['status'] = true;
        deeObj['count'] = 0;
        deeObj['message'] = message;
    }
};

export const isDEEWorking = () => {
    try {
        return deeObj['status'] || deeObj['count'] < 3;
    } catch (error) {
        return false;
    }
};
