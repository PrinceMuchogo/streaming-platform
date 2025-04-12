import { Product } from "./product"
import { User } from "./user"

export type ProductReview = {
    id: string
  userID: string
  user: User
  productID: string
  product: Product
  review: string
  createdAt: Date
  updatedAt: Date
}