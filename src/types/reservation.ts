export type ReservationRow = {
  id: string
  full_name: string
  phone: string
  guest_count: number
  note: string | null
  /** Object path (`proofs/...`) or legacy full Storage URL from older rows */
  payment_proof_url: string | null
  created_at: string
  /** Present only on admin list API: short-lived signed URL for private bucket */
  payment_proof_view_url?: string | null
}
