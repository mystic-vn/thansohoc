import AdminNavbar from '@/app/components/AdminNavbar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminNavbar />
      <div className="py-6">
        {children}
      </div>
    </div>
  );
} 