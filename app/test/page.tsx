export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ✅ Deployment Test Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          If you can see this page, your Next.js app is deployed and working correctly.
        </p>
        <div className="space-y-3">
          <a
            href="/"
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
          <a
            href="/debug"
            className="block w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Debug Information
          </a>
          <a
            href="/api/health"
            className="block w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Health Check API
          </a>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>Environment: {process.env.NODE_ENV || 'development'}</p>
          <p>Site URL: {process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}
