import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { SidebarNav } from './sidebar-nav';

export default async function SalesmanLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'salesman') {
    redirect('/salesman/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav name={session.name} />
      <div className="flex-1 lg:ml-64">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center gap-3">
          <SidebarNav mobile name={session.name} />
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
