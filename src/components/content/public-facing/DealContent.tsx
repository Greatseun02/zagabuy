"use client";

import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import DealLayout from "@/components/layouts/DealLayout";
import Loader from "@/components/ui/loader";
import NotFound from "@/components/ui/NotFound";
import {
  useReadDealByDealIdQuery,
  useUpdateDealMutation,
} from "@/services/dealService";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DealContent() {
  const params = useParams();
  const router = useRouter();

  const dealId = params?.id ?? "";

  const { data, isLoading } = useReadDealByDealIdQuery(dealId as string);
  // const [updateDeal] = useUpdateDealMutation();
  // console.log(data?.data, "data");

  // useEffect(() => {
  //   console.log(data?.data, "data");
  //   if (data?.data) {
  //     alert("my guy");
  //     updateDeal({
  //       ...data?.data,
  //       dealId: Number(dealId),
  //       dealViews: data?.data?.dealViews + 1,
  //       dealImagesUrl: data?.data?.dealImages,
  //     });
  //   }
  // }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DashboardPageLayout
      actionConfigs={[
        {
          onClick() { router.back(); },
          startIcon: <ChevronLeft />,
          text: "Back to Deals",
          variant: "transparent",
        },
      ]}
      containerClassName="p-5"
    >
      {data?.data ? <DealLayout {...data?.data} /> : <NotFound />}
    </DashboardPageLayout>
  );
}
