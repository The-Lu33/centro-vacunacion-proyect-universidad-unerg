"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Spinner } from "./spinner";

interface SpinnerContextType {
  isLoading: boolean;
  show: () => void;
  hide: () => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export function SpinnerProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const show = useCallback(() => setIsLoading(true), []);
  const hide = useCallback(() => setIsLoading(false), []);

  return (
    <SpinnerContext.Provider value={{ isLoading, show, hide }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
       <Spinner className="text-blue-400 size-16  ">
        <span className="text-blue-400 text-base font-semibold">Cargando...</span>
      </Spinner>
        </div>
      )}
    </SpinnerContext.Provider>
  );
}

export function useSpinner() {
  const context = useContext(SpinnerContext);
  if (context === undefined) {
    throw new Error('useSpinner must be used within a SpinnerProvider');
  }
  return context;
}