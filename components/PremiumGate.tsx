'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface PremiumGateProps {
  children: ReactNode;
  isPremium: boolean;
  showUpgradePrompt?: boolean;
  upgradeMessage?: string;
  upgradeButtonText?: string;
  upgradePath?: string;
}

export default function PremiumGate({
  children,
  isPremium,
  showUpgradePrompt = true,
  upgradeMessage = "Upgrade to Premium to unlock advanced controls",
  upgradeButtonText = "Upgrade to Premium",
  upgradePath = "/guardian/billing"
}: PremiumGateProps) {
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Render children with overlay */}
      <div className={showUpgradePrompt ? "opacity-50 pointer-events-none" : ""}>
        {children}
      </div>
      
      {/* Premium upgrade overlay */}
      {showUpgradePrompt && (
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 flex items-center justify-center rounded-lg">
          <div className="text-center p-6 max-w-sm">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Premium Feature
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {upgradeMessage}
            </p>
            <Link
              href={upgradePath}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {upgradeButtonText}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
