'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
                Legacy AI
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/dashboard' ? 'border-b-2 border-indigo-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/repositories"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/dashboard/repositories' ? 'border-b-2 border-indigo-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Repositories
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {session && (
              <button
                onClick={() => signOut()}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}