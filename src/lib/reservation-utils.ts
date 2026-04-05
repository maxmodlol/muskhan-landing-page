const BUCKET = "payment-proofs"

export { BUCKET }

/**
 * Resolve object path inside the bucket from DB.
 * New rows store path only (`proofs/...`). Legacy rows store the full public URL.
 */
export function proofObjectPathFromDb(stored: string | null | undefined): string | null {
  if (!stored?.trim()) return null
  const s = stored.trim()
  if (s.startsWith("http://") || s.startsWith("https://")) {
    const marker = `/${BUCKET}/`
    const i = s.indexOf(marker)
    if (i === -1) return null
    return s.slice(i + marker.length).split("?")[0] ?? null
  }
  return s
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "upload"
}
