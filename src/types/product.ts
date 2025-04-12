import { ProductImage } from "./productImage";

export type Product = {
  id ?: string
  productName?: string
  description?: string
  productImage?: ProductImage
  productImageID?: string
  quantity?: number
  price?: string
  numReviews?: number
  rating?: number
  reviews?:[]
  createdAt?: Date
  updatedAt?: Date
};
