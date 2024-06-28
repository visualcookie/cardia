export interface User {
  id: string
  username: string
  email: string
  avatar?: string | null
  dob?: Date | null
  weight?: number | null
  height?: number | null
}
