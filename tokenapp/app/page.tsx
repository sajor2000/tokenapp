import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, ArrowRight, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">CLIF-CAT</h1>
              <p className="text-sm text-slate-600">Clinical Logic-Informed Foundation Model Tokenization</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Physician-Driven Tokenization for ICU Foundation Models
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            <span className="font-bold text-blue-600">Clinicians define clinical cut points.</span>{' '}
            <span className="font-bold text-green-600">App generates numeric tokenization.</span>{' '}
            <span className="font-bold text-purple-600">Data scientists deploy.</span>
          </p>
          <p className="text-base text-slate-600 mb-8">
            Foundation models learn <span className="font-semibold text-blue-600">clinical logic</span> and{' '}
            <span className="font-semibold text-green-600">numeric progression</span>, not statistical artifacts or arbitrary categories.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/projects/new?preset=quick-start" className="block">
              <Card className="h-full border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center gap-2">
                    ⚡ Quick Start
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-800">
                  <p className="font-semibold mb-2">5 minutes</p>
                  <p className="mb-3">Select 30 mCIDE variables → Use evidence-based defaults → Export all</p>
                  <p className="text-xs text-green-700 font-medium">✅ Best for rapid deployment</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/projects/new" className="block">
              <Card className="h-full border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    📋 Multi-Variable Project
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">20-30 minutes</p>
                  <p className="mb-3">Browse mCIDE catalog → Customize key variables → Batch export</p>
                  <p className="text-xs text-blue-700 font-medium">⚙️ Balance speed + customization</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/wizard/1" className="block">
              <Card className="h-full border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-purple-900 flex items-center gap-2">
                    🎯 Single Variable
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-purple-800">
                  <p className="font-semibold mb-2">5-10 minutes each</p>
                  <p className="mb-3">Deep customization for one variable with 6-step wizard</p>
                  <p className="text-xs text-purple-700 font-medium">🔬 Maximum control</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-6">
            <Link href="/docs">
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="h-4 w-4" /> View Documentation
              </Button>
            </Link>
          </div>
        </div>

        {/* New: mCIDE Multi-Variable Approach */}
        <Card className="max-w-4xl mx-auto mb-16 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 New: Handle All 80+ mCIDE Variables Efficiently</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-blue-800">
              <strong>Problem:</strong> Going through the 6-step wizard 80 times for every mCIDE variable takes ~8 hours.
            </p>
            <p className="text-sm text-blue-800">
              <strong>Solution:</strong> Multi-variable projects with evidence-based defaults for all continuous ICU measures.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">📚 mCIDE Variable Catalog</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 10 respiratory variables (FiO2, PEEP, tidal volume, etc.)</li>
                  <li>• 15 continuous medications (norepinephrine, propofol, etc.)</li>
                  <li>• 9 vitals (MAP, SpO2, heart rate, etc.)</li>
                  <li>• 50+ labs (lactate, creatinine, bilirubin, etc.)</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">✅ Evidence-Based Defaults</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Clinical anchors from guidelines (SSC 2021, KDIGO, ARDS Net)</li>
                  <li>• Domain-specific granularity recommendations</li>
                  <li>• Customize only the variables you care about</li>
                  <li>• Export all variables in one batch ZIP file</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-center font-semibold text-blue-900">
              ⏱️ Deploy tokenization for 30+ variables in 5 minutes vs 3+ hours manually
            </p>
          </CardContent>
        </Card>

        {/* The Problem/Solution */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">❌ Traditional Approach</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-red-800">
              <p className="mb-2"><strong>Data scientist calculates quartiles:</strong></p>
              <p className="font-mono bg-white p-2 rounded mb-2">[Q1=1.5, Q2=2.3, Q3=3.7]</p>
              <p className="mb-2"><strong>Problem:</strong> Lactate 2.01 and 3.99 in same bin</p>
              <p className="font-semibold">❌ LOST critical thresholds (2.0 sepsis, 4.0 severe sepsis)</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">✅ CLIF-CAT Approach</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-800">
              <p className="mb-2"><strong>Physician sets clinical anchors:</strong></p>
              <p className="font-mono bg-white p-2 rounded mb-2">2.0 (sepsis), 4.0 (severe sepsis)</p>
              <p className="mb-2"><strong>App locks these as bin boundaries</strong></p>
              <p className="font-semibold">✅ Sepsis thresholds PRESERVED in foundation model</p>
            </CardContent>
          </Card>
        </div>

        {/* FiO2 Example */}
        <Card className="max-w-4xl mx-auto mb-16 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">⚡ Example: FiO2 Tokenization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Clinician Input (Step 4):</h4>
                <div className="bg-white p-4 rounded border border-blue-200 text-sm space-y-2">
                  <p><strong>Variable:</strong> FiO2 (0.21-1.0)</p>
                  <p><strong>Anchor 1:</strong> 0.40 "Mild hypoxemia"</p>
                  <p><strong>Anchor 2:</strong> 0.60 "Moderate, ARDS concern"</p>
                  <p><strong>Anchor 3:</strong> 0.80 "Severe hypoxemia"</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">App Output (Step 6):</h4>
                <div className="bg-white p-4 rounded border border-green-200 text-sm space-y-1">
                  <p className="font-semibold text-green-900">✅ 16 bins generated</p>
                  <p className="text-xs text-slate-600">• 4 bins: 0.21 → 0.40 (normal)</p>
                  <p className="text-xs text-slate-600">• 4 bins: 0.40 → 0.60 (mild) ← anchor</p>
                  <p className="text-xs text-slate-600">• 4 bins: 0.60 → 0.80 (moderate) ← anchor</p>
                  <p className="text-xs text-slate-600">• 4 bins: 0.80 → 1.00 (severe) ← anchor</p>
                  <p className="mt-2 text-xs font-semibold text-green-700">Python code + CSV + docs ready</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-blue-800 text-center font-medium">
              🎯 Anchors (0.40, 0.60, 0.80) appear as EXACT bin boundaries, never crossed
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">How It Works</h3>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Select Variable & Upload Data', desc: 'Choose continuous numeric variable (e.g., FiO2, lactate) and provide ECDF data or range' },
              { step: 2, title: 'Assess Clinical Direction', desc: 'Indicate if higher/lower values are worse (e.g., FiO2 higher = worse)' },
              { step: 3, title: 'Define Normal Range', desc: 'Set the normal/target range boundaries (e.g., FiO2 normal = 0.21)' },
              { step: 4, title: '⭐ Mark Clinical Anchors (KEY STEP)', desc: 'Set evidence-based thresholds - app generates bins automatically around them', highlight: true },
              { step: 5, title: 'Specify Granularity', desc: 'Choose bins per zone - app fills zones with statistically even bins' },
              { step: 6, title: 'Review & Export', desc: 'App shows full tokenization - download CSV, Python, Markdown, JSON' },
            ].map((item) => (
              <div key={item.step} className={`flex gap-4 items-start ${item.highlight ? 'bg-amber-50 p-4 rounded-lg border-2 border-amber-300' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 ${item.highlight ? 'bg-amber-500' : 'bg-blue-600'} text-white rounded-full flex items-center justify-center font-bold`}>
                  {item.step}
                </div>
                <div>
                  <h4 className={`font-semibold ${item.highlight ? 'text-amber-900' : 'text-slate-900'}`}>{item.title}</h4>
                  <p className={`text-sm ${item.highlight ? 'text-amber-800' : 'text-slate-600'}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16 pt-16 border-t border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Why continuous numeric only?</h4>
              <p className="text-sm text-slate-700">
                Foundation models learn better from numeric progression (FiO2: 21% → 40% → 60% → 80% → 100%)
                than from arbitrary categorical jumps ("nasal_cannula" → "ventilator"). Continuous variables
                preserve granularity and allow models to learn numeric relationships.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">What about device types like ventilators?</h4>
              <p className="text-sm text-slate-700">
                Don't tokenize device categories. Instead, tokenize the continuous parameters (FiO2, PEEP, flow rate).
                The model will infer device types from parameter combinations. This approach captures the underlying
                physiology rather than arbitrary equipment labels.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">How many clinical anchors should I add?</h4>
              <p className="text-sm text-slate-700">
                Add anchors for every evidence-based threshold that matters: 2-3 for simple variables (lactate: 2.0, 4.0),
                3-5 for complex staging systems (creatinine KDIGO: 1.5, 2.0, 3.0). More anchors = more zones = finer granularity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Do I need to write any code?</h4>
              <p className="text-sm text-slate-700">
                <strong>No.</strong> You just set the clinical thresholds you care about. The app automatically generates
                all the bins, Python code, CSV files, and documentation. Your data scientist receives production-ready code.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/docs">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" /> Read Full Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-slate-600">
          <p>CLIF-CAT v1.0 | Clinical Logic-Informed Foundation Model Tokenization</p>
          <p className="mt-2">Developed for ICU clinicians and data scientists</p>
        </div>
      </footer>
    </div>
  );
}
