// app/(main)/layout.tsx
import Navbar from "@/components/layout/Navbar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
