import { Product } from "./product"
import { User } from "./user"

export type ProductRating = {
    id: string
  userID: string
  user: User
  productID: string
  product: Product
  rating: number
  createdAt: Date
  updatedAt: Date
}