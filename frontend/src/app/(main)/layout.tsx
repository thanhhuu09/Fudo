// app/(main)/layout.tsx
import Navbar from "@/components/layouts/Navbar";

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
