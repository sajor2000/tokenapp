'use client';

import { WizardProvider } from '@/lib/wizard-context';
import { FlaskConical } from 'lucide-react';
import Link from 'next/link';

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <FlaskConical className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">CLIF-CAT</h1>
                <p className="text-xs text-slate-600">Clinical Binning Wizard</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </WizardProvider>
  );
}
