import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#f5f5f7]">
        <AdminSidebar />

        <main className="ml-[250px] p-10">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}