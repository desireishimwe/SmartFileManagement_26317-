import axiosInstance from './axiosConfig';

export const otpApi = {
    request: async (email: string): Promise<void> => {
        await axiosInstance.post('/otp/request', { email });
    },
    verify: async (email: string, code: string): Promise<boolean> => {
        const response = await axiosInstance.post('/otp/verify', { email, code });
        return response.data.valid;
    }
};
