import { Store } from "./store";
import { Payment } from "./payment";
import { OrderProduct } from "./orderProduct";

export type Order = {
  id?: string;
  userID?: string;
  user?: string;
  storeID?: string;
  store?: Store;
  shippingAddress?: string;
  amount?: string;
  status?: string;
  orderProducts?: OrderProduct[];
  createdAt?: Date;
  updatedAt?: Date;
  payment?: Payment;
  paymentId?: string;
  paymentMethod?: string;
};
