import * as XLSX from 'xlsx';
import { axiosClient } from '../services/httpClient';

export const calculateSize = (files) => {
    let size = 0;
    const toMb = 1048599.6;
    for (let i = 0; i < files.length; i++) {
        size += Math.round(files[i].size / toMb);
    }
    return size;
};
export const acceptValues = {
    '.doc': '.msword',
    '.jpg': '.jpeg',
    '.mkv': '.x-matroska'
};

export const remove_file = (file) => {
    const body = { file: file };
    axiosClient
        .post('/file/delete', body)
        .then(() => {
            //  TODO
        })
        .catch(() => {
            // TODO
        });
};

export const upload_file = async (file, uploadWithContentType = false, uploadParams = false) => {
    const formData = new FormData();
    formData.append('file', file);
    if (uploadWithContentType) {
        formData.append('uploadWithContentType', JSON.stringify(uploadWithContentType));
    }
    if (uploadParams) {
        Object.keys(uploadParams).forEach((param) => {
            formData.append(param, JSON.stringify(uploadParams[param]));
        });
    }
    try {
        const response = await axiosClient.post('/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        // TODO
        return { error: error?.response?.data?.error || 'Error uploading file' };
    }
};

/**
 * Base64 image URI identifier
 * @summary This function checks if the URI passed is a base64 image URI and then return it in an encoded format
 * @param {string} imageUrl - Image URI
 * @return {string} Encoded base64 URI or Original URL
 */
export const checkImageUri = (imageUrl) => {
    let finalURL = imageUrl;
    if (/^data:image\/.+;base64/.test(imageUrl)) {
        finalURL = encodeURI(imageUrl);
    }
    return finalURL;
};

export const getCurrencySymbol = (input) => {
    switch (input.toLowerCase()) {
        case 'dollars':
            return '$';
        case 'euros':
            return '€';
        case 'pounds':
            return '£';
        default:
            return input;
    }
};

export const downloadFile = (data, fileType) => {
    let fileName = data.fileName ? data.fileName : 'TableData';
    //     data.table_data,
    //     function (data_item) {
    //         var response = {};
    //         _.each(data.table_headers, function (table_header, table_header_index) {
    //             if (
    //                 typeof data_item[table_header_index] === 'object' &&
    //                 data_item[table_header_index] &&
    //                 data_item[table_header_index].value
    //             ) {
    //                 response[table_header] = data_item[table_header_index].value;
    //             } else {
    //                 response[table_header] = data_item[table_header_index];
    //             }
    //         });
    //         return response;
    //     },
    //     this
    // );
    const workbook = XLSX.utils.book_new();

    try {
        if (fileType === 'xlsx') {
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
            XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
        } else if (fileType === 'csv') {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const csvContent = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${fileName}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            throw new Error(`Unknown file type selected: ${fileType}`);
        }
    } catch (err) {
        return err;
    }
};

export const isMobileDevice = () => {
    const agent = navigator.userAgent;
    const isMobileAgent =
        agent.includes('Android') ||
        agent.includes('iPhone') ||
        agent.includes('webOS') ||
        agent.includes('iPad') ||
        agent.includes('iPod') ||
        agent.includes('BlackBerry') ||
        agent.includes('Windows Phone');

    return isMobileAgent;
};
