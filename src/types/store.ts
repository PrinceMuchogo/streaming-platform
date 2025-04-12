import { Product } from "./product"

export type Store = {
    id: string
  storeName: string
  storeLogo: string
  imagePublicID: string
  storeOwnerID: string
  storeOwner: string
  products?: Product[]
  createdAt: Date
  updatedAt: Date
  payment:   []
  order: []
}