import { Metadata } from 'next'
import Link from 'next/link'
import { 
  BookOpen, 
  Play, 
  Users, 
  Gift, 
  Video, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Home,
  GraduationCap
} from 'lucide-react'

type Props = { params: Promise<{ age: string }> };

export default async function ModulePage({ params }: Props) {
  const { age } = await params;
  
  const getAgeBandTitle = (ageBand: string) => {
    switch (ageBand) {
      case '6-9': return 'Ages 6–9 · Spark Curiosity & Creativity';
      case '10-13': return 'Ages 10–13 · Build Skills & Confidence';
      case '14-17': return 'Ages 14–17 · Innovate & Launch';
      default: return 'Course Module';
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to {getAgeBandTitle(age)}</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-3">🎉 Enrollment Successful!</h2>
          <p className="text-green-700 mb-4">
            Your Robotics Starter Kit will be delivered within 5-7 business days. 
            You now have access to all recorded lessons and weekly meet-ups.
          </p>
          <div className="text-sm text-green-600">
            <p><strong>Next Steps:</strong></p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Check your email for course access details</li>
              <li>Join our weekly online meet-ups</li>
              <li>Start with the first lesson below</li>
              <li>Monthly fee of ₵299 starts in 30 days</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">📚 Course Content</h3>
            <p className="text-blue-700 text-sm">
              Your personalized learning journey starts here. Each lesson builds on the previous one, 
              creating a comprehensive understanding of coding and robotics.
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">🤖 Robotics Kit</h3>
            <p className="text-purple-700 text-sm">
              Your starter kit includes all the components needed for hands-on learning. 
              Track your delivery status in your dashboard.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Available Lessons</h3>
          <div className="space-y-3">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Lesson 1: Introduction to Coding</h4>
              <p className="text-sm text-gray-600">Learn the basics of programming concepts</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Lesson 2: Your First Program</h4>
              <p className="text-sm text-gray-600">Write and run your first code</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Lesson 3: Robotics Basics</h4>
              <p className="text-sm text-gray-600">Understanding how robots work</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team or join our community forum.
          </p>
        </div>
      </div>
    </div>
  );
}
