import React, { createContext, useRef } from 'react';

type InputContextType = React.MutableRefObject<HTMLInputElement | null>;
export const InputContext = createContext<InputContextType | null>(null);

export function InputProvider({ children }: { children: React.ReactNode }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <InputContext.Provider value={inputRef}>{children}</InputContext.Provider>
  );
}
