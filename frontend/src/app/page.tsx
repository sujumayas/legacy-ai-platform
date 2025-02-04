import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Legacy AI Platform</h1>
        <p className="text-xl mb-4">
          Modernize your Java codebase with AI assistance
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  )
}