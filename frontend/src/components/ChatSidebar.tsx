import { FileText, MessageSquareText, Plus, Sparkles } from 'lucide-react'

type ChatSidebarProps = {
  documentCount: number
  hasConversation: boolean
  onNewChat: () => void
}

export function ChatSidebar({ documentCount, hasConversation, onNewChat }: ChatSidebarProps) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="FastRAG, accueil">
        <span className="brand-mark"><Sparkles size={19} strokeWidth={2.3} /></span>
        <span className="brand-name">fast<span>rag</span></span>
      </a>
      <button className="new-chat-button" onClick={onNewChat}><Plus size={17} strokeWidth={2.2} /><span>Nouvelle conversation</span></button>
      <div className="sidebar-section">
        <p className="section-label">ESPACE DE TRAVAIL</p>
        <button className="nav-item nav-item-active"><MessageSquareText size={17} /><span>Assistant documentaire</span><span className="nav-dot" /></button>
      </div>
      <div className="sidebar-section history-section">
        <p className="section-label">RÉCENT</p>
        {hasConversation ? <button className="history-item"><span className="history-indicator" /><span className="history-title">Conversation en cours</span></button> : <p className="empty-history">Vos conversations apparaîtront ici.</p>}
      </div>
      <div className="sidebar-bottom">
        <div className="knowledge-card">
          <div className="knowledge-heading"><span className="knowledge-icon"><FileText size={16} /></span><span>Base de connaissances</span></div>
          <p className="knowledge-count">{documentCount} <span>{documentCount > 1 ? 'documents indexés' : 'document indexé'}</span></p>
          <div className="knowledge-progress"><span style={{ width: documentCount > 0 ? '100%' : '8%' }} /></div>
          <p className="knowledge-caption">Importez vos fichiers depuis le chat</p>
        </div>
        <div className="profile-row"><div className="profile-avatar">F</div><div className="profile-copy"><strong>FastRAG</strong><span>Espace personnel</span></div><span className="profile-menu">···</span></div>
      </div>
    </aside>
  )
}