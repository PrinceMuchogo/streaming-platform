import { Subscription } from "./subscription";

export type PackageType = {
  id: string;
  interval: string;
  name: string;
  amount: string;
  createdAt?: Date;
  updatedAt?: Date;
  subscriptions?: Subscription[];
};
