import { Layers, Moon, Sun } from 'lucide-react';

type TopbarProps = {
    isDark: boolean;
    onToggleTheme: () => void;
};

export default function Topbar({ isDark, onToggleTheme }: TopbarProps) {
    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface/90 px-6 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-txt-main max-md:hidden">
                <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface-muted text-txt-main">
                    <Layers size={14} />
                </div>
                <span className="font-medium">FastRAG Assistant</span>
                <span className="rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[10px] font-normal text-txt-muted">
                    v1.0
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border bg-surface-muted/80 px-3 py-1 text-xs text-txt-muted">
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-online opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-status-online" />
                    </span>
                    <span className="text-[11px] font-medium text-txt-main">
                        API Locale
                    </span>
                </div>
                <button
                    className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-txt-muted transition hover:bg-surface-muted hover:text-txt-main"
                    type="button"
                    onClick={onToggleTheme}
                    aria-label={
                        isDark
                            ? 'Passer au thème clair'
                            : 'Passer au thème sombre'
                    }
                    aria-pressed={isDark}
                    title={
                        isDark
                            ? 'Passer au thème clair'
                            : 'Passer au thème sombre'
                    }
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>
        </header>
    );
}
