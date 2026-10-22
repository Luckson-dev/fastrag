import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from 'react';
import {
    ArrowDown,
    ArrowUp,
    FileText,
    Paperclip,
    Layers,
    X,
} from 'lucide-react';
import Topbar from './Topbar';
import type { ChatMessage } from './chatTypes';
import TypingIndicator from './TypingIndicator';
import MessageBubble from './MessageBubble';

type ChatViewProps = {
    messages: ChatMessage[];
    isLoading: boolean;
    isIngesting: boolean;
    onSend: (question: string) => void;
    onUpload: (file: File) => void;
    isDark: boolean;
    onToggleTheme: () => void;
};

const suggestions = [
    {
        number: '01',
        title: 'Synthétiser un document',
        prompt: 'Peux-tu me faire une synthèse des documents disponibles ?',
    },
    {
        number: '02',
        title: 'Trouver une information',
        prompt: 'Quelles sont les informations clés à retenir ?',
    },
    {
        number: '03',
        title: 'Comparer des idées',
        prompt: 'Compare les principaux sujets abordés dans mes documents.',
    },
];

export function ChatView({
    messages,
    isLoading,
    isIngesting,
    onSend,
    onUpload,
    isDark,
    onToggleTheme,
}: ChatViewProps) {
    const [question, setQuestion] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isBusy = isLoading || isIngesting;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading, isIngesting]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
        }
    }, [question]);

    function submit(event?: FormEvent) {
        event?.preventDefault();
        if (isBusy) return;
        if (selectedFile) {
            onUpload(selectedFile);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        const trimmed = question.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setQuestion('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
        }
    }

    return (
        <section className="relative flex h-full min-w-0 flex-1 flex-col bg-app-bg text-txt-main">
            {/* Header */}
            <Topbar isDark={isDark} onToggleTheme={onToggleTheme} />

            {/* Zone de conversation */}
            <div
                className="min-h-0 flex-1 overflow-y-auto px-4"
                ref={scrollRef}
                onScroll={(event) =>
                    setIsScrolled(event.currentTarget.scrollTop > 30)
                }
            >
                {messages.length === 0 ? (
                    <div className="mx-auto max-w-2xl pt-16 pb-8 text-center animate-reveal">
                        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl bg-accent text-white shadow-md">
                            <Layers size={18} />
                        </div>

                        <h1 className="font-display text-2xl font-semibold tracking-tight text-txt-main sm:text-3xl">
                            Que souhaitez-vous explorer ?
                        </h1>
                        <p className="mt-2 text-sm text-txt-muted max-w-md mx-auto">
                            Posez une question sur vos fichiers ou importez un
                            document pour commencer l'analyse.
                        </p>

                        {/* Suggestions */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.number}
                                    onClick={() => onSend(suggestion.prompt)}
                                    className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:border-txt-light hover:shadow-md"
                                >
                                    <span className="text-[10px] font-bold tracking-wider text-txt-light uppercase">
                                        {suggestion.number}
                                    </span>
                                    <span className="mt-2 text-xs font-medium text-txt-main group-hover:text-black">
                                        {suggestion.title}
                                    </span>
                                    <span className="mt-3 text-[11px] text-txt-muted line-clamp-2">
                                        "{suggestion.prompt}"
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-txt-light">
                            <FileText size={15} />
                            <span>Formats : PDF, TXT, DOCX</span>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto max-w-3xl space-y-6 py-6">
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}

                        {isLoading && (
                            <TypingIndicator label="Analyse des documents..." />
                        )}
                        {isIngesting && (
                            <TypingIndicator label="Indexation du fichier..." />
                        )}
                    </div>
                )}
            </div>

            {/* Bouton de retour en bas */}
            {isScrolled && messages.length > 0 && (
                <button
                    className="absolute right-1/2 bottom-24 translate-x-1/2 flex size-8 items-center justify-center rounded-full border border-border bg-surface text-txt-muted shadow-sm hover:bg-surface-muted"
                    onClick={() =>
                        scrollRef.current?.scrollTo({
                            top: scrollRef.current.scrollHeight,
                            behavior: 'smooth',
                        })
                    }
                >
                    <ArrowDown size={14} />
                </button>
            )}

            {/* Zone de saisie */}
            <div className="mx-auto w-full max-w-3xl px-4 pb-4 pt-2">
                <form
                    className="relative rounded-2xl border border-border bg-surface p-3 shadow-sm focus-within:border-txt-light"
                    onSubmit={submit}
                >
                    {selectedFile && (
                        <div className="mb-2 flex w-fit items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs text-txt-main">
                            <FileText size={14} className="text-txt-muted" />
                            <span className="max-w-[200px] truncate font-medium">
                                {selectedFile.name}
                            </span>
                            <button
                                type="button"
                                className="ml-1 rounded p-0.5 text-txt-light hover:text-txt-main"
                                onClick={() => {
                                    setSelectedFile(null);
                                    if (fileInputRef.current)
                                        fileInputRef.current.value = '';
                                }}
                            >
                                <X size={13} />
                            </button>
                        </div>
                    )}

                    <textarea
                        ref={textareaRef}
                        className="block w-full resize-none border-0 bg-transparent px-1 py-1 text-sm text-txt-main placeholder:text-txt-light focus:outline-none"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            selectedFile
                                ? 'Ajoutez une instruction...'
                                : 'Posez votre question...'
                        }
                        rows={1}
                        disabled={isBusy}
                    />

                    <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2">
                        <div className="flex items-center gap-2">
                            <input
                                ref={fileInputRef}
                                className="hidden"
                                type="file"
                                onChange={(e) =>
                                    setSelectedFile(e.target.files?.[0] ?? null)
                                }
                            />
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-txt-muted hover:bg-surface-muted hover:text-txt-main transition"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Paperclip size={15} />
                                <span>Joindre</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="flex size-8 items-center justify-center rounded-lg bg-accent text-white transition hover:bg-accent-hover disabled:opacity-30"
                            disabled={
                                isBusy || (!question.trim() && !selectedFile)
                            }
                        >
                            <ArrowUp size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
