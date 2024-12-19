import { axiosClient } from 'services/httpClient.js';

export async function resetPassword(params) {
    try {
        const response = await axiosClient.post('/user/update-password', {
            password: params.password,
            new_password: params.new_password,
            confirm_password: params.confirm_password
        });
        return { status: true, data: response.data };
    } catch (error) {
        return { status: false, data: error.response.data };
    }
}

export async function updatePassword(params) {
    try {
        const password_token = localStorage.getItem('forgotPasswordToken');
        const response = await axiosClient.post(
            '/user/change-password',
            {
                email: params.email,
                password: params.password,
                confirm_password: params.confirm_password
            },
            {
                headers: {
                    password_token
                }
            }
        );
        return { status: true, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            if (error.response.status === 429) {
                return {
                    status: false,
                    data: {
                        error: 'Too many requests. Please wait a few minutes before trying again.'
                    }
                };
            } else {
                return { status: false, data: error.response.data };
            }
        }
    }
}

export const createVerificationCode = async ({ email }) => {
    try {
        let response = await axiosClient.post('/user/generate-code', {
            email
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const validateOtp = async ({ code, userId }) => {
    try {
        let response = await axiosClient.post(
            '/user/validate-otp',
            {
                code
            },
            {
                headers: {
                    userId
                }
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};
