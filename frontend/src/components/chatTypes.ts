export type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: string[];
    createdAt: Date;
    isError?: boolean;
};
