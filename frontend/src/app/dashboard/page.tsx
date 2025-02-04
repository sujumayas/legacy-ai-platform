import { getServerSession } from 'next-auth/next';

export default async function DashboardPage() {
  const session = await getServerSession();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Project
          </button>
        </div>
      </div>
      
      {/* Project list will be added here */}
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No projects yet. Click "New Project" to get started.</p>
      </div>
    </div>
  );
}