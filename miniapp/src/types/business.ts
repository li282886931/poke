export type Role = 'resident' | 'master'
export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'pending_confirmation'
  | 'matching'
  | 'sellable'
  | 'closed'
  | 'expired'

export interface Listing {
  id: string
  title: string
  category: string
  district: string
  distance: string
  time: string
  status: ListingStatus
  description: string
  specs: string[]
  createdAt: string
}

export interface Match {
  id: string
  listingId: string
  title: string
  category: string
  district: string
  distance: string
  time: string
  publishTime: string
  status: 'priority' | 'available' | 'expired'
  priorityOwnerId?: string
  priorityText?: string
  creditCost: number
  reason: string[]
}

export interface Message {
  id: string
  title: string
  content: string
  time: string
  type: 'review' | 'match' | 'unlock' | 'system'
  read: boolean
}
