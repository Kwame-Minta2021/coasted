'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Instructor Test Page</h1>
        <p className="text-gray-600">This page loads without any database calls.</p>
        <p className="text-gray-600 mt-2">If this loads quickly, the issue is with the login page specifically.</p>
      </div>
    </div>
  )
}
