import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">CLIF-CAT Documentation</h1>
        <p className="text-lg text-slate-600 mb-8">
          Complete guide to creating clinician-driven tokenization schemes for ICU foundation models
        </p>

        {/* The Core Workflow */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>The Clinician → App → Data Scientist Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-blue-50 p-4 rounded border-2 border-blue-300">
                  <h3 className="font-bold text-blue-900 mb-2">1. Clinician Input</h3>
                  <p className="text-sm text-blue-800">
                    Set evidence-based clinical thresholds (anchors) with citations
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    Example: FiO2 anchors at 0.40, 0.60, 0.80
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-slate-400" />
              <div className="flex-1">
                <div className="bg-green-50 p-4 rounded border-2 border-green-300">
                  <h3 className="font-bold text-green-900 mb-2">2. App Generates</h3>
                  <p className="text-sm text-green-800">
                    Automatic bin generation with anchors as exact boundaries
                  </p>
                  <p className="text-xs text-green-700 mt-2">
                    Result: 16 bins covering 0.21-1.0 range
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-slate-400" />
              <div className="flex-1">
                <div className="bg-purple-50 p-4 rounded border-2 border-purple-300">
                  <h3 className="font-bold text-purple-900 mb-2">3. Data Scientist Uses</h3>
                  <p className="text-sm text-purple-800">
                    Production-ready Python code + documentation
                  </p>
                  <p className="text-xs text-purple-700 mt-2">
                    4 files: CSV, Python, Markdown, JSON
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Continuous Only */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Continuous Numeric Variables Only?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Foundation Models Learn Better from Numeric Progression</h3>
              <p className="text-sm text-slate-700 mb-3">
                When a foundation model sees FiO2 values progressing through bins (0.21 → 0.30 → 0.40 → 0.60 → 0.80 → 1.0),
                it learns the <strong>continuous relationship</strong> between values. This is far more powerful than
                learning arbitrary categorical jumps like "nasal_cannula" → "ventilator".
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">❌ Categorical Approach</h4>
                <div className="text-sm text-red-800 space-y-2">
                  <p><strong>Problem 1:</strong> No numeric relationship</p>
                  <p className="text-xs">Token "ventilator" has no numeric distance from "nasal_cannula"</p>
                  <p><strong>Problem 2:</strong> Lost granularity</p>
                  <p className="text-xs">FiO2 40% and 100% both map to "ventilator"</p>
                  <p><strong>Problem 3:</strong> No clinical anchors</p>
                  <p className="text-xs">Can't preserve evidence-based thresholds</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">✅ CLIF-CAT Approach</h4>
                <div className="text-sm text-green-800 space-y-2">
                  <p><strong>Advantage 1:</strong> Numeric progression</p>
                  <p className="text-xs">Model learns FiO2 0.60 is between 0.40 and 0.80</p>
                  <p><strong>Advantage 2:</strong> Full granularity</p>
                  <p className="text-xs">16 bins from 21% to 100% capture full range</p>
                  <p><strong>Advantage 3:</strong> Clinical anchors preserved</p>
                  <p className="text-xs">0.60 (ARDS threshold) is exact boundary</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">💡 What About Device Types?</h4>
              <p className="text-sm text-blue-800">
                Device types (nasal cannula, HFNC, ventilator) are <strong>inferred from parameter combinations</strong>,
                not encoded as tokens:
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4">
                <li>• Nasal cannula: FiO2 0.21-0.44, flow 1-6 L/min, PEEP 0</li>
                <li>• HFNC: FiO2 0.30-1.0, flow 30-70 L/min, PEEP ~5</li>
                <li>• Mechanical ventilation: FiO2 0.21-1.0, PEEP 5-25, pressure support</li>
              </ul>
              <p className="text-sm text-blue-800 mt-2">
                The model learns these patterns from continuous parameters, not from categorical labels.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FiO2 Example Walkthrough */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Complete Example: FiO2 Tokenization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Step 1: Variable & Data</h4>
                <p className="text-sm text-slate-700">Upload ECDF for FiO2 or enter range: 0.21 to 1.0</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Step 2: Clinical Direction</h4>
                <p className="text-sm text-slate-700">Select: <span className="font-mono bg-slate-100 px-2 py-1 rounded">higher_worse</span> (higher FiO2 = worse hypoxemia)</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Step 3: Normal Range</h4>
                <p className="text-sm text-slate-700">Set: 0.21 to 0.21 (room air is normal)</p>
              </div>

              <div className="bg-amber-50 p-4 rounded border-2 border-amber-300">
                <h4 className="font-semibold text-amber-900 mb-2">⭐ Step 4: Clinical Anchors (KEY STEP)</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-3 rounded border border-amber-200">
                    <p className="font-semibold text-slate-900">Anchor 1: 0.40</p>
                    <p className="text-xs text-slate-600">Label: Mild hypoxemia threshold</p>
                    <p className="text-xs text-slate-600">Evidence: Clinical practice, requires supplemental O2</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-amber-200">
                    <p className="font-semibold text-slate-900">Anchor 2: 0.60</p>
                    <p className="text-xs text-slate-600">Label: Moderate hypoxemia, ARDS concern</p>
                    <p className="text-xs text-slate-600">Evidence: Berlin Definition 2012 (P/F ratio correlates)</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-amber-200">
                    <p className="font-semibold text-slate-900">Anchor 3: 0.80</p>
                    <p className="text-xs text-slate-600">Label: Severe hypoxemia</p>
                    <p className="text-xs text-slate-600">Evidence: ARDS Network, refractory hypoxemia</p>
                  </div>
                </div>
                <p className="text-sm text-amber-800 mt-3">
                  💡 App will now generate ~16 bins with these as <strong>exact boundaries</strong>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Step 5: Granularity</h4>
                <p className="text-sm text-slate-700">Choose 4 bins per zone (app fills zones automatically)</p>
              </div>

              <div className="bg-green-50 p-4 rounded border-2 border-green-300">
                <h4 className="font-semibold text-green-900 mb-2">Step 6: Review & Export</h4>
                <p className="text-sm text-green-800 mb-2">App generated 16 bins:</p>
                <div className="font-mono text-xs text-green-700 bg-white p-3 rounded space-y-1">
                  <p>resp_fio2_normal_0p21_to_0p26</p>
                  <p>resp_fio2_normal_0p26_to_0p32</p>
                  <p>resp_fio2_normal_0p32_to_0p36</p>
                  <p>resp_fio2_normal_0p36_to_0p40  ← 0.40 anchor</p>
                  <p>resp_fio2_mild_0p40_to_0p46</p>
                  <p>resp_fio2_mild_0p46_to_0p52</p>
                  <p>resp_fio2_mild_0p52_to_0p56</p>
                  <p>resp_fio2_mild_0p56_to_0p60  ← 0.60 anchor</p>
                  <p>resp_fio2_moderate_0p60_to_0p67</p>
                  <p>resp_fio2_moderate_0p67_to_0p73</p>
                  <p>resp_fio2_moderate_0p73_to_0p77</p>
                  <p>resp_fio2_moderate_0p77_to_0p80  ← 0.80 anchor</p>
                  <p>resp_fio2_severe_0p80_to_0p87</p>
                  <p>resp_fio2_severe_0p87_to_0p93</p>
                  <p>resp_fio2_severe_0p93_to_0p97</p>
                  <p>resp_fio2_severe_0p97_to_1p00</p>
                </div>
                <p className="text-sm text-green-800 mt-3">
                  ✅ Download 4 files: CSV, Python, Markdown, JSON
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Q: Can I tokenize device types (nasal cannula, ventilator, etc.)?</h4>
              <p className="text-sm text-slate-700">
                <strong>A:</strong> No. CLIF-CAT only tokenizes continuous numeric variables. Device types should be inferred
                from continuous parameters (FiO2, flow rate, PEEP combinations), not encoded as categorical tokens.
                This allows foundation models to learn numeric relationships rather than arbitrary category jumps.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Q: What if I want to use categorical scales like GCS or RASS?</h4>
              <p className="text-sm text-slate-700">
                <strong>A:</strong> If the scale has numeric values (GCS 3-15, RASS -5 to +4), treat it as continuous
                and set clinical anchors at critical thresholds (e.g., GCS 8 = severe brain injury, GCS 13 = mild).
                The numeric progression will be preserved even though the scale has discrete values.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Q: How many anchors should I add?</h4>
              <p className="text-sm text-slate-700">
                <strong>A:</strong> Add anchors for every evidence-based threshold that matters clinically. Typical ranges:
              </p>
              <ul className="text-sm text-slate-600 ml-6 mt-2 space-y-1">
                <li>• Simple variables: 2-3 anchors (e.g., lactate: 2.0, 4.0)</li>
                <li>• Complex variables: 3-5 anchors (e.g., creatinine: 1.5, 2.0, 3.0 for KDIGO staging)</li>
                <li>• More anchors = more zones = more granular tokenization</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Q: What happens if my data doesn't match the anchors?</h4>
              <p className="text-sm text-slate-700">
                <strong>A:</strong> The app validates that all anchors fall within your data range. If an anchor is outside
                the range, you'll see an error in Step 4. This prevents generating bins that don't align with your actual data.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Q: Can I modify the generated bins?</h4>
              <p className="text-sm text-slate-700">
                <strong>A:</strong> The bins are automatically generated to ensure anchors are exact boundaries. You control
                the binning by adjusting:
              </p>
              <ul className="text-sm text-slate-600 ml-6 mt-2 space-y-1">
                <li>• Number and values of clinical anchors (Step 4)</li>
                <li>• Granularity (bins per zone) in Step 5</li>
                <li>• Normal range boundaries (Step 3)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Get Started */}
        <div className="text-center">
          <Link href="/wizard/1">
            <Button size="lg" className="gap-2">
              Start Creating Your Tokenization
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
