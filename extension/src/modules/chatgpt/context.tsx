import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import chatgpt from './chatgpt';
import { PORT_NAME } from '../../../../port-name';

type ChatGPTContextType = {
  sendMessage: (message: string) => void;
};
const ChatGPTContext = createContext<ChatGPTContextType | null>(null);

export function ChatGTPProvider({ children }: { children: React.ReactNode }) {
  const sendMessage = useCallback((message: string) => {
    chatgpt.sendMsg(message)
  }, []);

  const value = useMemo(() => ({ sendMessage }), [sendMessage]);

  useEffect(() => {
    const port = chrome.runtime.connect({ name: PORT_NAME });


    const markdownObserver = new MutationObserver((mutations) => {
      // Loop through the mutations to check for changes in the number of divs with the 'markdown' class
      mutations.forEach((mutation) => {
        port.postMessage({ type: mutation.type, text: mutation.target.textContent});
      });
    });

    const observer = new MutationObserver((mutations) => {
      // Loop through the mutations to check for changes in the number of divs with the 'markdown' class
      mutations.forEach((mutation) => {
        const addedNodes = Array.from(mutation.addedNodes);

        const addedDivs = addedNodes.filter(node => {
          if(node.tagName !== 'DIV') {
            return false;
          }
          console.log(node);

          return node.classList.contains('group') && node.classList.contains('w-full') && node.classList.contains('text-gray-800') && node.classList.contains('dark:text-gray-100') && node.classList.contains('border-b') && node.classList.contains('border-black/10') && node.classList.contains('dark:border-gray-900/50') && node.classList.contains('bg-gray-50');
        });

        if(addedDivs.length > 0) {
          const responseContainer = addedDivs[0].querySelector('.markdown')

          port.postMessage({ type: 'new_response', html: responseContainer.cloneNode() })

          if(responseContainer) {
            markdownObserver.observe(responseContainer, { childList: true, subtree: true, characterData: true });
          }
        }
      });
    });

    const observerOptions = { childList: true, subtree: true };
    observer.observe(document.documentElement, observerOptions);
  }, []);

  return <ChatGPTContext.Provider value={value}>{children}</ChatGPTContext.Provider>;
}

export function useChatGPT() {
  const context = useContext(ChatGPTContext);
  if (context === null) {
    throw new Error('useChatGPT must be used within a ChatGPTProvider');
  }
  return context;
}
