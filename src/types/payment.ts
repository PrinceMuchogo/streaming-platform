import { Store } from "./store"

export type Payment = {
    id: string
  userID: string
  user: {}
  storeID: string
  store: Store
  amount: string
  paymentMethod: string
  paymentStatus: string
  order: []
  createdAt: Date
  updatedAt: Date
}