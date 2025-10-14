'use client';

/**
 * Projects Browser Page
 *
 * View all saved multi-variable projects and create new ones.
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Calendar, FileText, Download, Trash2 } from 'lucide-react';
import { useProject } from '@/lib/project-context';
import { downloadProjectZip } from '@/lib/batch-export-utils';

export default function ProjectsPage() {
  const { allProjects, loadProject, deleteProject } = useProject();

  const handleDelete = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      deleteProject(projectId);
    }
  };

  const handleExport = async (projectId: string) => {
    const project = allProjects.find((p) => p.id === projectId);
    if (!project) return;

    try {
      await downloadProjectZip(project);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export project. Please ensure all variables have generated bins.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Multi-Variable Projects</h1>
          <p className="text-slate-600">
            Manage tokenization projects for multiple mCIDE variables
          </p>
        </div>

        {/* Create New Project Button */}
        <div className="mb-8">
          <Link href="/projects/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create New Project
            </Button>
          </Link>
        </div>

        {/* Projects List */}
        {allProjects.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderOpen className="h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-600 mb-6 text-center max-w-md">
                Create your first multi-variable project to tokenize multiple mCIDE variables efficiently
              </p>
              <Link href="/projects/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((project) => {
              const variablesWithBins = project.variables.filter((v) => v.bins);
              const readyForExport = variablesWithBins.length > 0;

              return (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-all border-2 border-slate-200 hover:border-blue-300"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-xs text-blue-600">Total Variables</p>
                        <p className="font-bold text-blue-900">{project.metadata.totalVariables}</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <p className="text-xs text-green-600">Using Defaults</p>
                        <p className="font-bold text-green-900">{project.metadata.usingDefaults}</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <p className="text-xs text-purple-600">Customized</p>
                        <p className="font-bold text-purple-900">{project.metadata.customized}</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-600">Ready to Export</p>
                        <p className="font-bold text-amber-900">{variablesWithBins.length}</p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/projects/${project.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(project.id)}
                        disabled={!readyForExport}
                        title={readyForExport ? 'Export as ZIP' : 'No variables ready for export'}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Ready status */}
                    {readyForExport ? (
                      <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-700">
                        ✅ Ready for export: {variablesWithBins.length} variable{variablesWithBins.length !== 1 ? 's' : ''}
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-700">
                        ⏳ Configure variables and generate bins to enable export
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
