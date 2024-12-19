import { createAsyncThunk } from '@reduxjs/toolkit';
import crypto from 'crypto';

export const getMatomoPvid = createAsyncThunk(
    'notification/getMatomoPvid',
    async (params, { fulfillWithValue }) => {
        const token = await new Promise((resolve) => {
            crypto.randomBytes(3, function (err, buffer) {
                var token = buffer.toString('hex');
                resolve(token);
            });
        });
        let updatedToken;
        if (params === 'app') {
            updatedToken = 'a' + token.substring(1);
        } else if (params === 'minerva') {
            updatedToken = 'm' + token.substring(1);
        } else if (params === 'PDFramework') {
            updatedToken = 'pd' + token.substring(2);
        } else if (params === 'design') {
            updatedToken = 'd' + token.substring(1);
        } else if (params === 'adminTable') {
            updatedToken = 'aT' + token.substring(2);
        } else if (params === 'navigator') {
            updatedToken = 'n' + token.substring(1);
        } else if (params === 'stories') {
            updatedToken = 's' + token.substring(1);
        } else if (params === 'bulkUserUpload') {
            updatedToken = 'b' + token.substring(1);
        } else {
            updatedToken = token;
        }
        return fulfillWithValue(updatedToken);
    }
);
