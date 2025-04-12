import { Subscription } from "./subscription";

export type Syspayment = {
  id: string;
  subscriptionId: string;
  amount: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: Subscription;
};
