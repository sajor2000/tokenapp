'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DISEASE_TEMPLATES } from '@/lib/templates';
import { DiseaseTemplate } from '@/types';
import { FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/wizard-context';

export function TemplateLoader() {
  const router = useRouter();
  const { resetWizard, updateVariableConfig, setStep } = useWizard();

  const loadTemplate = (template: DiseaseTemplate, variableIndex: number) => {
    // Reset wizard state
    resetWizard();

    // Load the selected variable from the template
    const variable = template.variables[variableIndex];
    
    // Pre-populate wizard with template data
    updateVariableConfig({
      name: variable.name,
      unit: variable.unit,
      direction: variable.direction,
      normalRange: variable.normalRange,
      anchors: variable.anchors,
      zoneConfigs: variable.zoneConfigs,
    });

    // Start at step 2 (variable info) since name is already set
    setStep(2);
    router.push('/wizard/2');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Start with a Template
        </h2>
        <p className="text-slate-600">
          Pre-configured variable templates based on clinical guidelines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DISEASE_TEMPLATES.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
              <Badge variant="outline" className="w-fit mt-2">
                {template.guideline}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Variables included:
                </p>
                <ul className="space-y-2">
                  {template.variables.map((variable, index) => (
                    <li key={index} className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {variable.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          {variable.anchors.length} clinical anchor{variable.anchors.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => loadTemplate(template, index)}
                        className="gap-1"
                      >
                        Load
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-600 mb-3">
                  Templates include:
                </p>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Pre-defined clinical anchors
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Evidence-based thresholds
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Recommended zone configurations
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
        <strong>Note:</strong> Templates provide a starting point. You can modify anchors, 
        zone configurations, and all parameters after loading.
      </div>
    </div>
  );
}
