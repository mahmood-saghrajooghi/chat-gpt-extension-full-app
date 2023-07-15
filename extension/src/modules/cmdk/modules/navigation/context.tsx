import { createContext, useCallback, useMemo, useState } from 'react';

type NavigationContextType = {
  pages: string[];
  activePage: string;
  push: (page: string) => void;
  pop: () => void;
};

export const NavigationContext = createContext<NavigationContextType | null>(
  null
);

export const PAGES = {
  HOME: 'home',
  NEW_PROMPT: 'new_prompt',
  READ_PROMPT: 'read_prompt',
} as const;

export type Page = (typeof PAGES)[keyof typeof PAGES];

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pages, setPages] = useState<string[]>([PAGES.NEW_PROMPT]);
  const activePage = pages[pages.length - 1];

  const pop = useCallback(() => {
    setPages((pages) => {
      const x = [...pages];
      x.splice(-1, 1);
      return x;
    });
  }, []);

  const push = useCallback((page: string) => {
    setPages((pages) => [...pages, page]);
  }, []);

  const contextValue = useMemo(
    () => ({
      pages,
      activePage,
      push,
      pop,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pages.length, push, pop]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}
