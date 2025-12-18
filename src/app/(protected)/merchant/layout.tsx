import { MerchantLayout } from "@/components/layouts/MerchantLayout";

export default function layout({ children }: { children: React.ReactNode }) {
  return <MerchantLayout>{children}</MerchantLayout>;
}
