"use client";

import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import DealLayout from "@/components/layouts/DealLayout";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Button as BaseButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/loader";
import NotFound from "@/components/ui/NotFound";
import { useAppModal } from "@/hooks/useAppModal";
import {
  useDeleteDealMutation,
  useReadDealByDealIdQuery,
} from "@/services/dealService";
import { BaseUtil } from "@/utilities/baseUtil";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { ChevronLeft, EllipsisVertical, Menu } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MerchantViewContent() {
  const params = useParams();
  const router = useRouter();
  const confirm = useAppModal(ConfirmationModal);

  const dealId = params?.dealId ?? "";

  const [deleteDeal] = useDeleteDealMutation();

  const { data, isLoading, refetch } = useReadDealByDealIdQuery(
    dealId as string
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DashboardPageLayout
      actionConfigs={[
        {
          asNode: (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <BaseButton
                  variant="transparent"
                  startIcon={<EllipsisVertical />}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `${RouteConstant.merchant.deals.editDeal.path}/${dealId}`
                    )
                  }
                >
                  Edit Deal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    confirm.show({
                      title: "Delete Deal",
                      description: `Are you sure you want to delete the deal "${data?.data?.dealTitle}"?`,
                      onConfirm: async () => {
                        const response = await deleteDeal({
                          dealId: Number(dealId),
                        }).unwrap();
                        if (BaseUtil.isApiResponseSuccessful(response)) {
                          toast.success("Deal deleted successfully");
                          router.push(RouteConstant.merchant.deals.path);
                        }
                        confirm.hide();
                      },
                      onCancel() {
                        confirm.hide();
                      },
                    })
                  }
                >
                  Delete Deal
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `${RouteConstant.merchant.deals.viewDealAnalytics.path}/${dealId}`
                    )
                  }
                >
                  View Analytics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("click")}>
                  Change Visibility
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]}
      headerLeft={
        <BaseButton
          onClick={() => router.back()}
          startIcon={<ChevronLeft />}
          children="Back to Deals"
          variant="transparent"
        />
      }
    >
      {data?.data ? <DealLayout {...data?.data} /> : <NotFound />}
    </DashboardPageLayout>
  );
}
