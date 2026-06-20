const BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

function getClientId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("documind_client_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("documind_client_id", id)
  }
  return id
}

// ── Documents ──────────────────────────────────────────
export async function uploadDocument(file: File) {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${BASE}/api/documents/upload`, {
    method: "POST", body: form,
    headers: {
      "X-Client-Id": getClientId()
    }
  })
  return res.json()
}

export async function getDocuments() {
  const res = await fetch(`${BASE}/api/documents/`, {
    headers: {
      "X-Client-Id": getClientId()
    }
  })
  return res.json()
}

export async function deleteDocument(id: string) {
  const res = await fetch(`${BASE}/api/documents/${id}`, {
    method: "DELETE",
    headers: {
      "X-Client-Id": getClientId()
    }
  })
  return res.json()
}

export async function downloadDocument(id: string) {
  window.open(`${BASE}/api/documents/${id}/download`)
}

export function getDownloadUrl(docId: string) {
  return `${BASE}/api/documents/${docId}/download`
}

export async function renameDocument(
  id: string,
  filename: string
) {
  const res = await fetch(
    `${BASE}/api/documents/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
      }),
    }
  )

  return res.json()
}

// ── Chat ───────────────────────────────────────────────
export async function sendMessage(
  query: string,
  documentId: string,
  sessionId?: string
) {
  const res = await fetch(`${BASE}/api/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Id": getClientId()
    },
    body: JSON.stringify({ query, document_id: documentId, session_id: sessionId || null })
  })
  return res
}

export async function getChatSessions() {
  const res = await fetch(`${BASE}/api/chat/sessions`, {
    headers: {
      "X-Client-Id": getClientId()
    }
  })
  return res.json()
}

export async function getChatSession(id: string) {
  const res = await fetch(`${BASE}/api/chat/sessions/${id}`)
  return res.json()
}

export async function deleteChatSession(id: string) {
  const res = await fetch(`${BASE}/api/chat/sessions/${id}`, { method: "DELETE" })
  return res.json()
}

// ── Settings ───────────────────────────────────────────
export async function getSettings() {
  const res = await fetch(`${BASE}/api/settings/`)
  return res.json()
}

export async function updateSettings(settings: Record<string, unknown>) {
  const res = await fetch(`${BASE}/api/settings/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  })
  return res.json()
}

export async function clearStorage() {
  const res = await fetch(`${BASE}/api/settings/storage`, {
    method: "DELETE",
    headers: {
      "X-Client-Id": getClientId()
    }
  })
  return res.json()
}

export async function getStorageStats() {
  const res = await fetch(`${BASE}/api/settings/storage-stats`, {
    headers: {
      "X-Client-Id": getClientId()
    }
  })
  return res.json()
}

export async function searchEverything(
  query: string
) {
  const res = await fetch(
    `${BASE}/api/search/?q=${encodeURIComponent(query)}`
  )

  if (!res.ok) {
    throw new Error('Search failed')
  }

  return res.json()
}