import { apiClient } from './client';
import { handleAxiosError } from './handleError';

type QueryResponse = {
    answer: string;
    sources: string[];
};
type IngestResponse = {
    message: string;
    documents_count: number;
};

export async function queryRag(question: string): Promise<QueryResponse> {
    try {
        const response = await apiClient.post<QueryResponse>('/query/', {
            question,
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function ingestDocument(file: File): Promise<IngestResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post<IngestResponse>(
            '/ingest/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}
