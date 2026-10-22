import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowDown, ArrowUp, Check, ChevronDown, FileText, Globe2, Paperclip, Sparkles, X } from 'lucide-react'
import type { ChatMessage } from './chatTypes'

type ChatViewProps = {
  messages: ChatMessage[]
  isLoading: boolean
  isIngesting: boolean
  onSend: (question: string) => void
  onUpload: (file: File) => void
}

const suggestions = [
  { number: '01', title: 'Synthétiser un document', prompt: 'Peux-tu me faire une synthèse des documents disponibles ?' },
  { number: '02', title: 'Trouver une information', prompt: 'Quelles sont les informations clés à retenir ?' },
  { number: '03', title: 'Comparer des idées', prompt: 'Compare les principaux sujets abordés dans mes documents.' },
]

export function ChatView({ messages, isLoading, isIngesting, onSend, onUpload }: ChatViewProps) {
  const [question, setQuestion] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isBusy = isLoading || isIngesting

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isLoading, isIngesting])

  function submit(event?: FormEvent) {
    event?.preventDefault()
    if (isBusy) return
    if (selectedFile) {
      onUpload(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    const trimmed = question.trim()
    if (!trimmed) return
    onSend(trimmed)
    setQuestion('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <section className="chat-area" id="top">
      <header className="topbar">
        <div className="workspace-title"><span className="workspace-icon"><Sparkles size={15} /></span><span>Assistant documentaire</span><ChevronDown size={15} className="muted-icon" /></div>
        <div className="topbar-actions"><span className="connection-status"><span /> API locale</span><button className="topbar-button" title="Recherche dans votre base de connaissances"><Globe2 size={16} /><span>Sources privées</span></button><div className="topbar-avatar">F</div></div>
      </header>

      <div className="conversation-scroll" ref={scrollRef} onScroll={(event) => setIsScrolled(event.currentTarget.scrollTop > 24)}>
        {messages.length === 0 ? (
          <div className="welcome-view">
            <div className="welcome-kicker"><span className="kicker-line" /> VOTRE ESPACE DE CONNAISSANCES <span className="kicker-line" /></div>
            <div className="welcome-spark"><Sparkles size={22} strokeWidth={1.7} /></div>
            <h1>Les bonnes réponses,<br /><span>dans vos documents.</span></h1>
            <p className="welcome-description">Posez une question à votre base documentaire.<br className="desktop-break" /> Je retrouve les passages utiles et vous indique mes sources.</p>
            <div className="suggestion-grid">
              {suggestions.map((suggestion) => <button className="suggestion-card" key={suggestion.number} onClick={() => onSend(suggestion.prompt)}><span className="suggestion-number">{suggestion.number}</span><span className="suggestion-title">{suggestion.title}</span><span className="suggestion-arrow">↗</span></button>)}
            </div>
            <div className="upload-hint"><span className="upload-hint-icon"><FileText size={17} /></span><span>Commencez par ajouter vos documents</span><span className="hint-separator">·</span><span className="hint-format">PDF, TXT, DOCX</span></div>
          </div>
        ) : (
          <div className="message-list">
            <div className="conversation-date"><span /> AUJOURD’HUI <span /></div>
            {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
            {isLoading && <TypingIndicator label="Recherche dans vos documents…" />}
            {isIngesting && <TypingIndicator label="Indexation du document…" />}
          </div>
        )}
      </div>

      {isScrolled && messages.length > 0 && <button className="scroll-bottom" onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })} aria-label="Aller au dernier message"><ArrowDown size={16} /></button>}

      <div className="composer-wrap">
        <form className="composer" onSubmit={submit}>
          {selectedFile && <div className="selected-file"><FileText size={14} /><span>{selectedFile.name}</span><button type="button" aria-label="Retirer le fichier" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}><X size={14} /></button></div>}
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={handleKeyDown} placeholder={selectedFile ? 'Ajoutez un message (facultatif)…' : 'Posez votre question…'} rows={1} aria-label="Votre question" disabled={isBusy} />
          <div className="composer-toolbar">
            <div className="composer-tools"><input ref={fileInputRef} className="visually-hidden" type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} /><button type="button" className="tool-button" onClick={() => fileInputRef.current?.click()} aria-label="Ajouter un document" title="Ajouter un document"><Paperclip size={17} /></button><span className="composer-divider" /><span className="search-scope"><span /> Recherche dans vos fichiers</span></div>
            <div className="send-area"><span className="send-shortcut">↵</span><button type="submit" className="send-button" aria-label={selectedFile ? 'Importer le document' : 'Envoyer'} disabled={isBusy || (!question.trim() && !selectedFile)}><ArrowUp size={18} /></button></div>
          </div>
        </form>
        <p className="composer-footnote">FastRAG peut se tromper. Vérifiez les sources avant de vous appuyer sur une réponse.</p>
      </div>
    </section>
  )
}

function TypingIndicator({ label }: { label: string }) {
  return <div className="typing-row"><span className="assistant-mini-mark"><Sparkles size={14} /></span><div className="typing-indicator"><i /><i /><i /></div><span>{label}</span></div>
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <article className={`message-row ${isUser ? 'message-user' : 'message-assistant'}`}>
      {!isUser && <span className={`assistant-mini-mark ${message.isError ? 'error-mark' : ''}`}><Sparkles size={14} /></span>}
      <div className="message-content-wrap">
        {!isUser && <div className="message-author">FastRAG <span>·</span> {message.isError ? 'Erreur' : 'Réponse'}</div>}
        <div className={`message-bubble ${message.isError ? 'message-error' : ''}`}>{message.content}</div>
        {message.sources && message.sources.length > 0 && <div className="source-block"><div className="source-heading"><span><Check size={13} /> SOURCES</span><span>{message.sources.length} {message.sources.length > 1 ? 'documents' : 'document'}</span></div><div className="source-list">{message.sources.map((source, index) => <div className="source-item" key={`${source}-${index}`}><span className="source-index">{String(index + 1).padStart(2, '0')}</span><FileText size={14} /><span className="source-name" title={source}>{source.split(/[\\/]/).pop()}</span><span className="source-open">↗</span></div>)}</div></div>}
        <span className="message-time">{message.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </article>
  )
}