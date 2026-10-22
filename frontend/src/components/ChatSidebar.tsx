import {
    FileText,
    MessageSquareText,
    Plus,
    Layers,
    Database,
    MoreHorizontal,
} from 'lucide-react';

type ChatSidebarProps = {
    documentCount: number;
    hasConversation: boolean;
    onNewChat: () => void;
};

export function ChatSidebar({
    documentCount,
    hasConversation,
    onNewChat,
}: ChatSidebarProps) {
    return (
        <aside className="flex w-64 shrink-0 flex-col bg-sidebar-bg px-3 py-4 text-white max-[900px]:w-56 max-[680px]:w-16 max-[680px]:items-center max-[680px]:px-2 border-r border-border-dark">
            {/* Brand Logo avec BrainCircuit */}
            <a
                className="mb-6 flex h-9 items-center gap-2.5 px-2 text-inherit no-underline max-[680px]:mb-5 max-[680px]:px-0"
                href="#top"
            >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-white border border-border-dark">
                    <Layers size={18} />
                </div>
                <span className="font-display text-lg font-bold tracking-tight text-white max-[680px]:hidden">
                    fast<span className="text-neutral-400">rag</span>
                </span>
            </a>

            {/* Nouveau Chat */}
            <button
                className="flex h-10 w-full items-center gap-2.5 rounded-xl bg-neutral-800 px-3 text-xs font-semibold text-white border border-border-dark transition hover:bg-neutral-700 max-[680px]:size-10 max-[680px]:justify-center max-[680px]:p-0"
                onClick={onNewChat}
            >
                <Plus
                    className="shrink-0 text-neutral-300"
                    size={18}
                    strokeWidth={2.5}
                />
                <span className="max-[680px]:hidden">Nouvelle chat</span>
            </button>

            {/* Espace */}
            <div className="mt-6 max-[680px]:hidden">
                <p className="px-2 mb-2 text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                    Espace
                </p>
                <button className="flex h-9 w-full items-center gap-2.5 rounded-lg bg-neutral-800/60 px-2.5 text-left text-xs font-medium text-neutral-200 border border-neutral-800">
                    <MessageSquareText className="text-neutral-400" size={16} />
                    <span className="truncate">Assistant RAG</span>
                    <span className="ml-auto size-1.5 rounded-full bg-status-online" />
                </button>
            </div>

            {/* Historique */}
            <div className="mt-6 max-[680px]:hidden">
                <p className="px-2 mb-2 text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                    Récents
                </p>
                {hasConversation ? (
                    <button className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs text-neutral-300 hover:bg-neutral-800/60 transition">
                        <span className="size-1.5 shrink-0 rounded-full bg-neutral-400" />
                        <span className="truncate">Conversation en cours</span>
                    </button>
                ) : (
                    <p className="px-2 py-2 text-xs text-neutral-500 italic">
                        Aucun historique.
                    </p>
                )}
            </div>

            {/* Footer / Base de connaissances */}
            <div className="mt-auto space-y-3 max-[680px]:hidden">
                <div className="rounded-xl border border-border-dark bg-black/40 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                        <div className="flex size-6 items-center justify-center rounded-md bg-neutral-800 text-neutral-400">
                            <Database size={14} />
                        </div>
                        <span>Base de connaissances</span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-xl font-bold text-white">
                            {documentCount}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                            {documentCount > 1 ? 'documents' : 'document'}
                        </span>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                        <div
                            className="h-full rounded-full bg-neutral-400 transition-all duration-500"
                            style={{
                                width:
                                    documentCount > 0
                                        ? `${Math.min(documentCount * 20, 100)}%`
                                        : '5%',
                            }}
                        />
                    </div>
                </div>

                {/* Profil utilisateur */}
                <div className="flex items-center gap-2.5 rounded-lg border border-border-dark bg-black/30 p-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-neutral-200">
                        F
                    </div>
                    <div className="flex flex-1 flex-col">
                        <span className="text-xs font-medium text-neutral-200">
                            FastRAG Admin
                        </span>
                        <span className="text-[10px] text-neutral-500">
                            Instance locale
                        </span>
                    </div>
                    <MoreHorizontal size={15} className="text-neutral-500" />
                </div>
            </div>
        </aside>
    );
}
