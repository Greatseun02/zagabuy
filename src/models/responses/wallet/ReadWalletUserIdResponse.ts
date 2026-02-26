import { BaseResponse } from "@/utilities/types";

export type ReadWalletUserIdResponse = {
  accountBalance?: string;
  accountLedgerBalance?: string;
  accountBankCode?: string;
  accountBankName?: string;
  accountBranchCode?: string;
  accountCurrency?: string;
  accountCustomerPhone?: string;
  accountName?: string;
  accountNumber?: string;
  responseCode: string;
  responseMessage: string;
};
