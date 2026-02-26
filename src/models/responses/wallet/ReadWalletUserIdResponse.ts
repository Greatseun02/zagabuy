import { BaseResponse } from "@/utilities/types";

export type ReadWalletUserIdResponse = BaseResponse<
  {
    walletAccountNumber: string;
    walletBalance: number;
    walletCreatedAt: string;
    walletExternalCustomerId: string;
    walletId: number;
    walletStatus: string;
    walletUpdatedAt: string;
    walletUserId: number;
  }[]
>;
