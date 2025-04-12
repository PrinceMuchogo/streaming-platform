import { Store } from "./store"

export type StoreOwner = {
    id: string
    name: string
    mobile: string
    address: string
    nationalID: string
    accountNumber: string
    creditCardSecurityKey: string
    image: string
    imagePublicID: string
    status: string
    createdAt: Date
    updatedAt: Date
    store: Store[]
}