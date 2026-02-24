import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 sm:pt-20 lg:pt-24">{children}</main>
      <SiteFooter />
    </>
  );
}

