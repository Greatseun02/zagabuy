import { Footer } from "@/components/menu/Footer";
import { Header } from "@/components/menu/Header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
