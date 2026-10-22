import { useState } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatView } from "./components/ChatView";
import type { ChatMessage } from "./components/chatTypes";
import { ingestDocument, queryRag } from "./services/rag";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);

  async function handleSend(question: string) {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
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
          role: "assistant",
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
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Une erreur est survenue pendant la recherche.",
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
          role: "assistant",
          content: result.message,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Le document n’a pas pu être importé.",
          isError: true,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsIngesting(false);
    }
  }

  return (
    <main className="app-shell">
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
      />
    </main>
  );
}
