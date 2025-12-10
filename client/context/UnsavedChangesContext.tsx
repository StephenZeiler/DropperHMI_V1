import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  pendingNavigation: string | null;
  setPendingNavigation: (path: string | null) => void;
  onSaveAndNavigate: (() => void) | null;
  setOnSaveAndNavigate: (callback: (() => void) | null) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(
  undefined
);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [onSaveAndNavigate, setOnSaveAndNavigate] = useState<(() => void) | null>(
    null
  );

  const value: UnsavedChangesContextType = {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    pendingNavigation,
    setPendingNavigation,
    onSaveAndNavigate,
    setOnSaveAndNavigate,
  };

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error(
      "useUnsavedChanges must be used within UnsavedChangesProvider"
    );
  }
  return context;
}
