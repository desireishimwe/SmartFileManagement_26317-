import axiosInstance from './axiosConfig';

export interface FileShareInfo {
    id: number;
    shareToken: string;
    expiresAt: string | null;
    createdAt: string;
    downloadCount: number;
}

export interface PublicFileInfo {
    fileName: string;
    fileSize: number;
    fileType: string;
    expiresAt: string | null;
    downloadCount: number;
}

export const fileShareApi = {
    // Create a new share link
    createShare: async (fileId: number, expirationDays?: number): Promise<FileShareInfo> => {
        const response = await axiosInstance.post<FileShareInfo>('/shares', {
            fileId,
            expirationDays: expirationDays ?? 30,
        });
        return response.data;
    },

    // Get all shares for a file
    getSharesByFile: async (fileId: number): Promise<FileShareInfo[]> => {
        const response = await axiosInstance.get<FileShareInfo[]>(`/shares/file/${fileId}`);
        return response.data;
    },

    // Delete a share
    deleteShare: async (shareId: number): Promise<void> => {
        await axiosInstance.delete(`/shares/${shareId}`);
    },

    // Get public share info (no auth required)
    getPublicInfo: async (token: string): Promise<PublicFileInfo> => {
        const response = await axiosInstance.get<PublicFileInfo>(`/shares/public/${token}/info`);
        return response.data;
    },

    // Get public download URL
    getPublicDownloadUrl: (token: string): string => {
        const baseUrl = axiosInstance.defaults.baseURL?.replace('/api', '') || '';
        return `${baseUrl}/api/shares/public/${token}`;
    },

    // Build shareable link
    buildShareableLink: (token: string): string => {
        return `${window.location.origin}/share/${token}`;
    },
};
