"use client";

import React, { useMemo, useRef } from "react";
import { BaseDataGrid, type BaseDataGridRef } from "@/components/BaseDataGrid";
import {
  useReadDealQuery,
  useDeleteDealMutation,
} from "@/services/dealService";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useAppModal } from "@/hooks/useAppModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MerchantDealsContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  const { data: resp, refetch } = useReadDealQuery();
  const [deleteDeal] = useDeleteDealMutation();
  const confirm = useAppModal(ConfirmationModal);
  const router = useRouter();

  const deals = useMemo(() => resp?.data || [], [resp]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "title",
        accessorKey: "dealTitle",
        header: "Title",
      },
      {
        id: "price",
        accessorKey: "dealPrice",
        header: "Price",
        cell: (info) => `$${((info.getValue() as number) ?? 0).toFixed(2)}`,
      },
      {
        id: "status",
        accessorKey: "dealStatus",
        header: "Status",
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const deal = info.row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="small"
                onClick={() => router.push(`/merchant/deals/${deal.dealId}`)}
              >
                View
              </Button>
              <Button
                size="small"
                onClick={() => router.push(`/merchant/deals/${deal.dealId}`)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="small"
                onClick={() => {
                  confirm.show({
                    title: `Delete ${deal.dealTitle}?`,
                    description: "This cannot be undone",
                    confirmText: "Delete",
                    confirmVariant: "destructive",
                    onConfirm: async () => {
                      try {
                        await deleteDeal({ dealId: deal.dealId }).unwrap();
                        toast.success("Deal deleted");
                        refetch();
                      } catch (err) {
                        toast.error("Failed to delete deal");
                      }
                    },
                  });
                }}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [confirm, deleteDeal, refetch, router]
  );

  return (
    <DashboardPageLayout title="My Deals" description="Manage your deals">
      <div className="mt-6">
        <BaseDataGrid
          ref={gridRef}
          data={deals}
          columns={columns}
          autoGenerateColumns={false}
          rowId="dealId"
          pageSizeOptions={[10, 25]}
        />
      </div>
    </DashboardPageLayout>
  );
}
