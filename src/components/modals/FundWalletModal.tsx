"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import { Copy, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReadWalletUserIdResponse } from "@/models/responses/wallet/ReadWalletUserIdResponse";

export interface FundWalletModalProps {
  wallet: ReadWalletUserIdResponse;
}

export const FundWalletModal = createAppModal<FundWalletModalProps>(
  ({ wallet }, modal) => {
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      // You could add a toast notification here
    };

    return (
      <div className="space-y-6">
        {/* Account Info Card */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 text-card-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Bank Account Details</p>
              <p className="text-xs text-muted-foreground">
                Transfer to this account to fund your wallet
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Bank Name */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Bank Name</p>
                <p className="text-sm font-semibold">
                  {wallet.accountBankName ?? "--"}
                </p>
              </div>
              {wallet.accountBankName && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(wallet.accountBankName ?? "")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Account Name */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Account Name</p>
                <p className="text-sm font-semibold">{wallet.accountName ?? "--"}</p>
              </div>
              {wallet.accountName && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(wallet.accountName ?? "")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Account Number</p>
                <p className="text-sm font-semibold tracking-wider">
                  {wallet.accountNumber ?? "--"}
                </p>
              </div>
              {wallet.accountNumber && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(wallet.accountNumber ?? "")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Use the account details above to transfer
            funds. Your wallet will be credited automatically after
            confirmation.
          </p>
        </div>
      </div>
    );
  },
);

FundWalletModal.displayName = "FundWalletModal";
