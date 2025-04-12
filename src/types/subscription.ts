import { PackageType } from "./package";
import { Syspayment } from "./sysPayment";
import { User } from "./user";

export type Subscription = {
  id?: string;
  packageId?: string;
  userId?: string;
  status?: string;
  expiresOn?: Date | null;
  createdAt?: Date;
  updateAt?: Date;
  user?: User;
  packageType?: PackageType;
  payment?: Syspayment[];
};
