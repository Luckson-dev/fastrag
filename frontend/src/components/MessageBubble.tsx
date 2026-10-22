import { User, Bot, Check, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { ChatMessage } from './chatTypes';

export default function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === 'user';

    return (
        <div
            className={`flex items-start gap-3 animate-message-in ${isUser ? 'flex-row-reverse' : ''}`}
        >
            <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                    isUser
                        ? 'bg-accent text-white'
                        : message.isError
                          ? 'bg-red-600 text-white'
                          : 'bg-surface-muted text-txt-main border border-border'
                }`}
            >
                {isUser ? <User size={15} /> : <Bot size={15} />}
            </div>

            <div
                className={`flex max-w-[85%] flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed overflow-x-auto ${
                        isUser
                            ? 'bg-accent text-white rounded-tr-none'
                            : message.isError
                              ? 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200 rounded-tl-none'
                              : 'bg-surface border border-border text-txt-main shadow-sm rounded-tl-none'
                    }`}
                >
                    {/* Rendu Markdown enrichi pour gérer les tableaux, listes et balises HTML */}
                    <div className="prose prose-sm max-w-none text-inherit leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                table: ({ node, ...props }) => (
                                    <div className="my-3 overflow-x-auto rounded-lg border border-border">
                                        <table
                                            className="w-full text-left text-xs border-collapse"
                                            {...props}
                                        />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => (
                                    <thead
                                        className="bg-surface-muted border-b border-border font-semibold text-txt-main"
                                        {...props}
                                    />
                                ),
                                th: ({ node, ...props }) => (
                                    <th
                                        className="px-3 py-2 border-r border-border last:border-r-0"
                                        {...props}
                                    />
                                ),
                                td: ({ node, ...props }) => (
                                    <td
                                        className="px-3 py-2 border-b border-r border-border last:border-r-0 last:border-b-0"
                                        {...props}
                                    />
                                ),
                                p: ({ node, ...props }) => (
                                    <p className="mb-2 last:mb-0" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                    <ul
                                        className="list-disc pl-5 my-2 space-y-1"
                                        {...props}
                                    />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol
                                        className="list-decimal pl-5 my-2 space-y-1"
                                        {...props}
                                    />
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>

                    {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 border-t border-border/50 pt-3">
                            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-txt-muted">
                                <Check
                                    size={13}
                                    className="text-status-online"
                                />
                                <span>Sources ({message.sources.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {message.sources.map((source, index) => (
                                    <div
                                        key={`${source}-${index}`}
                                        className="flex items-center gap-1.5 rounded-md border border-border bg-surface-muted px-2.5 py-1 text-xs text-txt-muted"
                                    >
                                        <FileText
                                            size={12}
                                            className="text-txt-light"
                                        />
                                        <span className="max-w-[180px] truncate font-medium">
                                            {source.split(/[\\/]/).pop()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <span className="mt-1 px-1 text-[10px] text-txt-light">
                    {message.createdAt.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>
        </div>
    );
}
