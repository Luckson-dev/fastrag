import { useLayoutEffect, useState } from 'react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatView } from './components/ChatView';
import type { ChatMessage } from './components/chatTypes';
import { ingestDocument, queryRag } from './services/rag.service';

export default function App() {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = window.localStorage.getItem('fastrag-theme');
        return savedTheme
            ? savedTheme === 'dark'
            : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isIngesting, setIsIngesting] = useState(false);
    const [documentCount, setDocumentCount] = useState(0);

    useLayoutEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        window.localStorage.setItem('fastrag-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    async function handleSend(question: string) {
        setMessages((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content: question,
                createdAt: new Date(),
            },
        ]);
        setIsLoading(true);
        try {
            const result = await queryRag(question);
            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: result.answer,
                    sources: result.sources,
                    createdAt: new Date(),
                },
            ]);
        } catch (error) {
            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content:
                        error instanceof Error
                            ? error.message
                            : 'Une erreur est survenue pendant la recherche.',
                    isError: true,
                    createdAt: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpload(file: File) {
        setIsIngesting(true);
        try {
            const result = await ingestDocument(file);
            setDocumentCount((count) => count + result.documents_count);
            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: result.message,
                    createdAt: new Date(),
                },
            ]);
        } catch (error) {
            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content:
                        error instanceof Error
                            ? error.message
                            : 'Le document n’a pas pu être importé.',
                    isError: true,
                    createdAt: new Date(),
                },
            ]);
        } finally {
            setIsIngesting(false);
        }
    }

    return (
        <main className="flex h-dvh min-h-[320px] overflow-hidden bg-app-bg">
            <ChatSidebar
                documentCount={documentCount}
                hasConversation={messages.length > 0}
                onNewChat={() => setMessages([])}
            />
            <ChatView
                messages={messages}
                isLoading={isLoading}
                isIngesting={isIngesting}
                onSend={handleSend}
                onUpload={handleUpload}
                isDark={isDark}
                onToggleTheme={() => setIsDark((current) => !current)}
            />
        </main>
    );
}
