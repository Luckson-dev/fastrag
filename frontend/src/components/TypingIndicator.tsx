import { Layers } from 'lucide-react';

export default function TypingIndicator({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3 text-xs text-txt-muted animate-message-in">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-txt-main border border-border">
                <Layers size={14} />
            </div>
            <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-txt-muted animate-pulse-dot" />
                <span className="size-1.5 rounded-full bg-txt-muted animate-pulse-dot [animation-delay:150ms]" />
                <span className="size-1.5 rounded-full bg-txt-muted animate-pulse-dot [animation-delay:300ms]" />
            </div>
            <span>{label}</span>
        </div>
    );
}
