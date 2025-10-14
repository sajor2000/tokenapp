'use client';

/**
 * mCIDE Variable Catalog Browser
 *
 * Browse all 80+ mCIDE continuous variables and add them to the current project.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Check, Info, Download, Home } from 'lucide-react';
import { useProject } from '@/lib/project-context';
import {
  ALL_MCIDE_VARIABLES,
  getMCIDECatalogStats,
  type MCIDEVariableDefinition,
} from '@/lib/mcide-catalog';
import Link from 'next/link';

type DomainFilter = 'all' | 'respiratory' | 'medications' | 'vitals' | 'labs';

export default function CatalogPage() {
  const router = useRouter();
  const { currentProject, addVariableToProject, isVariableInProject, getProjectVariable } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const stats = getMCIDECatalogStats();

  // Filter variables
  const filteredVariables = ALL_MCIDE_VARIABLES.filter((v) => {
    const matchesSearch =
      searchQuery === '' ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = domainFilter === 'all' || v.domain === domainFilter;

    return matchesSearch && matchesDomain;
  });

  const handleAddVariable = (mcideId: string) => {
    if (!currentProject) {
      if (confirm('No project selected. Would you like to create a new project first?')) {
        router.push('/projects/new');
      }
      return;
    }

    addVariableToProject(mcideId, true); // true = use defaults
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'respiratory':
        return '🫁';
      case 'medications':
        return '💊';
      case 'vitals':
        return '❤️';
      case 'labs':
        return '🔬';
      default:
        return '📊';
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'respiratory':
        return 'bg-blue-100 text-blue-800';
      case 'medications':
        return 'bg-purple-100 text-purple-800';
      case 'vitals':
        return 'bg-red-100 text-red-800';
      case 'labs':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">mCIDE Variable Catalog</h1>
              <p className="text-slate-600">
                Browse {stats.total} continuous ICU variables with evidence-based defaults
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              {currentProject && (
                <Link href="/projects">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Project
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Current Project Info */}
          {currentProject ? (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">Current Project: {currentProject.name}</p>
                    <p className="text-sm text-blue-700">
                      {currentProject.metadata.totalVariables} variables selected
                    </p>
                  </div>
                  <Link href="/projects">
                    <Button variant="outline" size="sm">
                      View Project →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <p className="text-amber-800">
                  ⚠️ No project selected. <Link href="/projects/new" className="underline font-semibold">Create a project</Link> to add variables.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search variables (e.g., lactate, fio2, norepinephrine)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Domain Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={domainFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDomainFilter('all')}
            >
              All ({stats.total})
            </Button>
            <Button
              variant={domainFilter === 'respiratory' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDomainFilter('respiratory')}
              className="gap-1"
            >
              🫁 Respiratory ({stats.byDomain.respiratory})
            </Button>
            <Button
              variant={domainFilter === 'medications' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDomainFilter('medications')}
              className="gap-1"
            >
              💊 Medications ({stats.byDomain.medications})
            </Button>
            <Button
              variant={domainFilter === 'vitals' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDomainFilter('vitals')}
              className="gap-1"
            >
              ❤️ Vitals ({stats.byDomain.vitals})
            </Button>
            <Button
              variant={domainFilter === 'labs' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDomainFilter('labs')}
              className="gap-1"
            >
              🔬 Labs ({stats.byDomain.labs})
            </Button>
          </div>
        </div>

        {/* Variables Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVariables.map((variable) => {
            const isInProject = isVariableInProject(variable.id);
            const projectVariable = getProjectVariable(variable.id);

            return (
              <Card
                key={variable.id}
                className={`transition-all ${
                  isInProject
                    ? 'border-2 border-green-400 bg-green-50'
                    : 'border-2 border-slate-200 hover:border-blue-300'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{getDomainIcon(variable.domain)}</span>
                        <Badge className={getDomainColor(variable.domain)} variant="secondary">
                          {variable.domain}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{variable.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {variable.id} • {variable.unit}
                      </CardDescription>
                    </div>
                    {isInProject && (
                      <div className="flex-shrink-0">
                        <div className="bg-green-600 text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Quick Info */}
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Range:</span>
                      <span className="font-medium">
                        {variable.typicalRange.min} - {variable.typicalRange.max} {variable.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Anchors:</span>
                      <span className="font-medium">{variable.defaultAnchors.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Direction:</span>
                      <span className="font-medium">
                        {variable.direction === 'higher_worse' ? '↑ worse' : variable.direction === 'lower_worse' ? '↓ worse' : '↕ both'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {isInProject ? (
                      <div className="flex-1 bg-green-100 border border-green-300 rounded-md p-2 text-xs text-green-800 text-center font-medium">
                        ✓ Added to project
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleAddVariable(variable.id)}
                        disabled={!currentProject}
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDetails(showDetails === variable.id ? null : variable.id)}
                    >
                      <Info className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {showDetails === variable.id && (
                    <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Clinical Rationale:</p>
                        <p className="text-slate-700">{variable.clinicalRationale}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Evidence:</p>
                        <p className="text-slate-700">{variable.evidenceCitation}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Default Anchors:</p>
                        <ul className="space-y-1 text-slate-700">
                          {variable.defaultAnchors.map((anchor, idx) => (
                            <li key={idx}>
                              • {anchor.value} {variable.unit} - {anchor.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredVariables.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Search className="h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No variables found</h3>
              <p className="text-slate-600 mb-6 text-center max-w-md">
                Try adjusting your search or domain filters
              </p>
              <Button onClick={() => { setSearchQuery(''); setDomainFilter('all'); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
