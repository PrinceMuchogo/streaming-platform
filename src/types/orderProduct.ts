import { Product } from "./product"

export type OrderProduct = {
    id : string
  orderID: string
  order: string
  productID: string
  product: Product
  createdAt: Date
  updatedAt: Date
}