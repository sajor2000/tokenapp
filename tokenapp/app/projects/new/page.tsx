'use client';

/**
 * Create New Project Page
 *
 * Initialize a new multi-variable project with optional quick-start bundles.
 */

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProject } from '@/lib/project-context';
import { ArrowRight, Zap, Stethoscope, HeartPulse, Activity } from 'lucide-react';
import type { QuickStartBundle } from '@/types';

const QUICK_START_BUNDLES: QuickStartBundle[] = [
  {
    id: 'sepsis-bundle',
    name: 'Sepsis & Shock Bundle',
    description: '15 critical variables for sepsis detection and shock management',
    icon: '🦠',
    mcideVariableIds: [
      'lactate',
      'map',
      'norepinephrine',
      'vasopressin',
      'temp_c',
      'heart_rate',
      'respiratory_rate',
      'wbc',
      'creatinine',
      'bilirubin_total',
      'platelet',
      'fio2_set',
      'spo2',
      'gcs_total',
      'sbp',
    ],
    estimatedTime: '5 minutes with defaults',
  },
  {
    id: 'ards-bundle',
    name: 'ARDS & Mechanical Ventilation',
    description: '12 respiratory support variables for ARDS management',
    icon: '🫁',
    mcideVariableIds: [
      'fio2_set',
      'peep_set',
      'tidal_volume_set',
      'plateau_pressure_set',
      'peak_inspiratory_pressure_set',
      'resp_rate_set',
      'pressure_control_set',
      'pressure_support_set',
      'lpm_set',
      'spo2',
      'respiratory_rate',
      'propofol',
    ],
    estimatedTime: '5 minutes with defaults',
  },
  {
    id: 'aki-bundle',
    name: 'Acute Kidney Injury',
    description: '8 variables for AKI detection and management',
    icon: '🩺',
    mcideVariableIds: [
      'creatinine',
      'lactate',
      'map',
      'norepinephrine',
      'sbp',
      'dbp',
      'hemoglobin',
      'platelet',
    ],
    estimatedTime: '3 minutes with defaults',
  },
  {
    id: 'full-mcide',
    name: 'Full mCIDE Set',
    description: 'All 40+ continuous mCIDE variables',
    icon: '🎯',
    mcideVariableIds: [
      // Respiratory (10)
      'fio2_set',
      'peep_set',
      'tidal_volume_set',
      'resp_rate_set',
      'peak_inspiratory_pressure_set',
      'plateau_pressure_set',
      'pressure_control_set',
      'pressure_support_set',
      'lpm_set',
      'inspiratory_time_set',
      // Medications (15)
      'norepinephrine',
      'epinephrine',
      'vasopressin',
      'dopamine',
      'phenylephrine',
      'dobutamine',
      'propofol',
      'fentanyl',
      'midazolam',
      'dexmedetomidine',
      'insulin',
      'heparin',
      'nitroglycerin',
      'nitroprusside',
      'milrinone',
      // Vitals (9)
      'temp_c',
      'heart_rate',
      'sbp',
      'dbp',
      'map',
      'spo2',
      'respiratory_rate',
      'gcs_total',
      'pain_scale',
      // Labs (7 key labs)
      'lactate',
      'creatinine',
      'bilirubin_total',
      'albumin',
      'platelet',
      'wbc',
      'hemoglobin',
    ],
    estimatedTime: '8 minutes with defaults',
  },
];

function CreateProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createProject, addMultipleVariables } = useProject();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedBundle, setSelectedBundle] = useState<string | null>(
    searchParams.get('preset') === 'quick-start' ? 'sepsis-bundle' : null
  );

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    // Create project
    createProject(projectName, projectDescription);

    // Add bundle variables if selected
    if (selectedBundle) {
      const bundle = QUICK_START_BUNDLES.find((b) => b.id === selectedBundle);
      if (bundle) {
        addMultipleVariables(bundle.mcideVariableIds, true); // true = use defaults
      }
    }

    // Navigate to catalog to add more variables
    router.push('/catalog');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Multi-Variable Project</CardTitle>
            <CardDescription>
              Configure multiple mCIDE variables in one project for batch export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., ICU Sepsis Tokenization"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="projectDescription">Description (optional)</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="e.g., Tokenization scheme for sepsis prediction model..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Quick Start Bundles */}
            <div>
              <Label className="mb-3 block">Quick Start Bundles (Optional)</Label>
              <p className="text-sm text-slate-600 mb-4">
                Select a pre-configured bundle of variables to get started quickly, or start with an empty project.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {QUICK_START_BUNDLES.map((bundle) => (
                  <Card
                    key={bundle.id}
                    className={`cursor-pointer transition-all ${
                      selectedBundle === bundle.id
                        ? 'border-2 border-blue-500 bg-blue-50'
                        : 'border-2 border-slate-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedBundle(bundle.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{bundle.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{bundle.name}</h4>
                          <p className="text-xs text-slate-600 mb-2">{bundle.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              {bundle.mcideVariableIds.length} variables
                            </span>
                            <span className="text-blue-600 font-medium">{bundle.estimatedTime}</span>
                          </div>
                        </div>
                        {selectedBundle === bundle.id && (
                          <div className="text-blue-600">✓</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Empty Project Option */}
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedBundle === null
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'border-2 border-slate-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedBundle(null)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">📋</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">Empty Project</h4>
                        <p className="text-xs text-slate-600 mb-2">
                          Start with no variables and manually select from the catalog
                        </p>
                        <div className="text-xs text-slate-500">Maximum flexibility</div>
                      </div>
                      {selectedBundle === null && (
                        <div className="text-blue-600">✓</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => router.push('/projects')}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} className="gap-2">
                Create Project & Browse Catalog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Info Note */}
            {selectedBundle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">ℹ️ Using Evidence-Based Defaults</p>
                <p>
                  The selected bundle will use clinically-validated default anchors and granularity.
                  You can customize any variable later in the catalog.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CreateProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateProjectContent />
    </Suspense>
  );
}
