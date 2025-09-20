'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isStudentPortal = pathname.startsWith('/student');
  const isInstructorPortal = pathname.startsWith('/instructor');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  if (isLoginPage || isStudentPortal || isInstructorPortal) {
    return (
      <>
        {children}
        {/* AI Chatbot - Available on all pages */}
        <Chatbot isOpen={isChatbotOpen} onToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      </>
    );
  }

  return (
    <>
      {/* Global chrome */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-white">Skip to content</a>
      <Navbar />

      {/* Page transition wrapper */}
      <main id="main" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* AI Chatbot - Available on all pages */}
      <Chatbot isOpen={isChatbotOpen} onToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
    </>
  );
}
