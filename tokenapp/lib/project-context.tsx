'use client';

/**
 * Project Context
 *
 * React Context for managing multi-variable project state.
 * Provides functionality to:
 * - Create new projects
 * - Add/remove variables from projects
 * - Switch between using defaults and custom configuration
 * - Save/load projects from localStorage
 * - Track project metadata
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Project,
  ProjectVariable,
  VariableConfig,
  TokenBin,
  ECDFDataPoint,
  DataRange,
  VariableStatus,
} from '@/types';
import { getMCIDEVariable, type MCIDEVariableDefinition } from './mcide-catalog';
import { generateBins } from './binning-algorithm';

interface ProjectContextType {
  currentProject: Project | null;
  allProjects: Project[];

  // Project operations
  createProject: (name: string, description: string) => void;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  updateProjectMetadata: (name: string, description: string) => void;

  // Variable operations
  addVariableToProject: (mcideId: string, useDefaults: boolean) => void;
  removeVariableFromProject: (mcideId: string) => void;
  updateVariableConfig: (mcideId: string, config: VariableConfig) => void;
  updateVariableStatus: (mcideId: string, status: VariableStatus) => void;

  // Binning operations
  generateBinsForVariable: (mcideId: string, ecdfData: ECDFDataPoint[], dataRange: DataRange) => void;
  generateBinsForAllVariables: (ecdfDataMap: Map<string, { ecdfData: ECDFDataPoint[]; dataRange: DataRange }>) => void;

  // Bulk operations
  addMultipleVariables: (mcideIds: string[], useDefaults: boolean) => void;
  resetAllToDefaults: () => void;

  // Utility
  getProjectVariable: (mcideId: string) => ProjectVariable | undefined;
  isVariableInProject: (mcideId: string) => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'clif-cat-projects';

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const projects = JSON.parse(stored) as Project[];
        setAllProjects(projects);
      } catch (error) {
        console.error('Failed to load projects from localStorage:', error);
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (allProjects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProjects));
    }
  }, [allProjects]);

  // Calculate project metadata
  const calculateMetadata = useCallback((variables: ProjectVariable[]) => {
    return {
      totalVariables: variables.length,
      usingDefaults: variables.filter((v) => v.status === 'using_defaults').length,
      customized: variables.filter((v) => v.status === 'customized').length,
      needsConfiguration: variables.filter((v) => v.status === 'needs_configuration').length,
    };
  }, []);

  // Create mCIDE variable config from definition
  const createConfigFromMCIDEDefinition = useCallback((def: MCIDEVariableDefinition): VariableConfig => {
    // Create zone configs based on default granularity
    const zoneConfigs = [
      {
        type: 'below' as const,
        lower: def.typicalRange.min,
        upper: def.normalRange.lower,
        bins: def.defaultGranularity.low,
      },
      {
        type: 'normal' as const,
        lower: def.normalRange.lower,
        upper: def.normalRange.upper,
        bins: def.defaultGranularity.normal,
      },
      {
        type: 'above_mild' as const,
        lower: def.normalRange.upper,
        upper: def.typicalRange.max,
        bins: def.defaultGranularity.high,
      },
    ];

    return {
      name: def.name,
      type: 'continuous',
      unit: def.unit,
      direction: def.direction,
      normalRange: def.normalRange,
      anchors: def.defaultAnchors,
      zoneConfigs,
      domain: def.domain,
    };
  }, []);

  const createProject = useCallback((name: string, description: string) => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variables: [],
      metadata: {
        totalVariables: 0,
        usingDefaults: 0,
        customized: 0,
        needsConfiguration: 0,
      },
    };
    setCurrentProject(newProject);
    setAllProjects((prev) => [...prev, newProject]);
  }, []);

  const loadProject = useCallback((projectId: string) => {
    const project = allProjects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  }, [allProjects]);

  const deleteProject = useCallback((projectId: string) => {
    setAllProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const updateProjectMetadata = useCallback((name: string, description: string) => {
    if (!currentProject) return;

    const updated: Project = {
      ...currentProject,
      name,
      description,
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject]);

  const addVariableToProject = useCallback((mcideId: string, useDefaults: boolean) => {
    if (!currentProject) return;

    const mcideDef = getMCIDEVariable(mcideId);
    if (!mcideDef) return;

    // Check if variable already in project
    if (currentProject.variables.some((v) => v.mcideId === mcideId)) {
      return;
    }

    const config = createConfigFromMCIDEDefinition(mcideDef);

    const newVariable: ProjectVariable = {
      mcideId,
      status: useDefaults ? 'using_defaults' : 'needs_configuration',
      config,
    };

    const updatedVariables = [...currentProject.variables, newVariable];
    const updated: Project = {
      ...currentProject,
      variables: updatedVariables,
      metadata: calculateMetadata(updatedVariables),
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject, createConfigFromMCIDEDefinition, calculateMetadata]);

  const removeVariableFromProject = useCallback((mcideId: string) => {
    if (!currentProject) return;

    const updatedVariables = currentProject.variables.filter((v) => v.mcideId !== mcideId);
    const updated: Project = {
      ...currentProject,
      variables: updatedVariables,
      metadata: calculateMetadata(updatedVariables),
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject, calculateMetadata]);

  const updateVariableConfig = useCallback((mcideId: string, config: VariableConfig) => {
    if (!currentProject) return;

    const updatedVariables = currentProject.variables.map((v) =>
      v.mcideId === mcideId
        ? { ...v, config, status: 'customized' as VariableStatus }
        : v
    );

    const updated: Project = {
      ...currentProject,
      variables: updatedVariables,
      metadata: calculateMetadata(updatedVariables),
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject, calculateMetadata]);

  const updateVariableStatus = useCallback((mcideId: string, status: VariableStatus) => {
    if (!currentProject) return;

    const updatedVariables = currentProject.variables.map((v) =>
      v.mcideId === mcideId ? { ...v, status } : v
    );

    const updated: Project = {
      ...currentProject,
      variables: updatedVariables,
      metadata: calculateMetadata(updatedVariables),
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject, calculateMetadata]);

  const generateBinsForVariable = useCallback((
    mcideId: string,
    ecdfData: ECDFDataPoint[],
    dataRange: DataRange
  ) => {
    if (!currentProject) return;

    const variable = currentProject.variables.find((v) => v.mcideId === mcideId);
    if (!variable) return;

    const bins = generateBins({
      variableConfig: variable.config,
      ecdfData,
      dataRange,
    });

    const updatedVariables = currentProject.variables.map((v) =>
      v.mcideId === mcideId
        ? { ...v, bins, ecdfData, dataRange }
        : v
    );

    const updated: Project = {
      ...currentProject,
      variables: updatedVariables,
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject]);

  const generateBinsForAllVariables = useCallback((
    ecdfDataMap: Map<string, { ecdfData: ECDFDataPoint[]; dataRange: DataRange }>
  ) => {
    if (!currentProject) return;

    const updatedVariables = currentProject.variables.map((v) => {
      const data = ecdfDataMap.get(v.mcideId);
      if (!data) return v;

      const bins = generateBins({
        variableConfig: v.config,
        ecdfData: data.ecdfData,
        dataRange: data.dataRange,
      });

      return {
        ...v,
        bins,
        ecdfData: data.ecdfData,
        dataRange: data.dataRange,
      };
    });

    const updated: Project = {
      ...currentProject,
      variables: updatedVariables,
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject]);

  const addMultipleVariables = useCallback((mcideIds: string[], useDefaults: boolean) => {
    if (!currentProject) return;

    const newVariables: ProjectVariable[] = mcideIds
      .filter((mcideId) => !currentProject.variables.some((v) => v.mcideId === mcideId))
      .map((mcideId) => {
        const mcideDef = getMCIDEVariable(mcideId);
        if (!mcideDef) return null;

        const config = createConfigFromMCIDEDefinition(mcideDef);

        return {
          mcideId,
          status: useDefaults ? ('using_defaults' as VariableStatus) : ('needs_configuration' as VariableStatus),
          config,
        };
      })
      .filter((v): v is ProjectVariable => v !== null);

    const updatedVariables = [...currentProject.variables, ...newVariables];
    const updated: Project = {
      ...currentProject,
      variables: updatedVariables,
      metadata: calculateMetadata(updatedVariables),
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject, createConfigFromMCIDEDefinition, calculateMetadata]);

  const resetAllToDefaults = useCallback(() => {
    if (!currentProject) return;

    const updatedVariables = currentProject.variables.map((v) => {
      const mcideDef = getMCIDEVariable(v.mcideId);
      if (!mcideDef) return v;

      const config = createConfigFromMCIDEDefinition(mcideDef);

      return {
        ...v,
        config,
        status: 'using_defaults' as VariableStatus,
        bins: undefined,
        ecdfData: undefined,
        dataRange: undefined,
        customizationNotes: undefined,
      };
    });

    const updated: Project = {
      ...currentProject,
      variables: updatedVariables,
      metadata: calculateMetadata(updatedVariables),
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    setAllProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, [currentProject, createConfigFromMCIDEDefinition, calculateMetadata]);

  const getProjectVariable = useCallback((mcideId: string): ProjectVariable | undefined => {
    return currentProject?.variables.find((v) => v.mcideId === mcideId);
  }, [currentProject]);

  const isVariableInProject = useCallback((mcideId: string): boolean => {
    return currentProject?.variables.some((v) => v.mcideId === mcideId) ?? false;
  }, [currentProject]);

  const value: ProjectContextType = {
    currentProject,
    allProjects,
    createProject,
    loadProject,
    deleteProject,
    updateProjectMetadata,
    addVariableToProject,
    removeVariableFromProject,
    updateVariableConfig,
    updateVariableStatus,
    generateBinsForVariable,
    generateBinsForAllVariables,
    addMultipleVariables,
    resetAllToDefaults,
    getProjectVariable,
    isVariableInProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}
