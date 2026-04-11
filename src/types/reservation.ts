export type ReservationRow = {
  id: string
  full_name: string
  phone: string
  guest_count: number
  note: string | null
  /** JSON array: `{ id, name, price, qty }[]` */
  menu_order: string | null
  created_at: string
}
