'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WizardState, VariableConfig, ECDFDataPoint, TokenBin } from '@/types';

interface WizardContextType {
  state: WizardState;
  updateVariableConfig: (config: Partial<VariableConfig>) => void;
  setECDFData: (data: ECDFDataPoint[]) => void;
  setGeneratedBins: (bins: TokenBin[]) => void;
  setStep: (step: number) => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const initialState: WizardState = {
  step: 1,
  variableConfig: {},
  ecdfData: [],
  generatedBins: [],
  dataRange: null,
};

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(initialState);

  const updateVariableConfig = (config: Partial<VariableConfig>) => {
    setState((prev) => ({
      ...prev,
      variableConfig: { ...prev.variableConfig, ...config },
    }));
  };

  const setECDFData = (data: ECDFDataPoint[]) => {
    const dataRange = data.length > 0
      ? {
          min: Math.min(...data.map((d) => d.value)),
          max: Math.max(...data.map((d) => d.value)),
        }
      : null;

    setState((prev) => ({
      ...prev,
      ecdfData: data,
      dataRange,
    }));
  };

  const setGeneratedBins = (bins: TokenBin[]) => {
    setState((prev) => ({ ...prev, generatedBins: bins }));
  };

  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, step }));
  };

  const resetWizard = () => {
    setState(initialState);
  };

  return (
    <WizardContext.Provider
      value={{
        state,
        updateVariableConfig,
        setECDFData,
        setGeneratedBins,
        setStep,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
}
