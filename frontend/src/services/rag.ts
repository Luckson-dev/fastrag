const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '')

type QueryResponse = { answer: string; sources: string[] }
type IngestResponse = { message: string; documents_count: number }

async function readError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { detail?: string }
    return payload.detail ?? `Erreur serveur (${response.status}).`
  } catch {
    return `Erreur serveur (${response.status}).`
  }
}

export async function queryRag(question: string): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/query/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) })
  if (!response.ok) throw new Error(await readError(response))
  return response.json() as Promise<QueryResponse>
}

export async function ingestDocument(file: File): Promise<IngestResponse> {
  const body = new FormData()
  body.append('file', file)
  const response = await fetch(`${API_BASE_URL}/ingest/`, { method: 'POST', body })
  if (!response.ok) throw new Error(await readError(response))
  return response.json() as Promise<IngestResponse>
}