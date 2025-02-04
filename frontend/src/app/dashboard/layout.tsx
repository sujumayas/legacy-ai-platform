import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import Navbar from '@/components/navigation/Navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}