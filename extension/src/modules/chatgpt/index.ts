import { PORT_NAME } from "~port-name"
import { useEffect, useRef } from "react"
import chatgpt from "~modules/chatgpt/chatgpt"
import { MessageTypeFactory } from "~types"
import throttle from "lodash/throttle"
import debounce from "lodash/debounce"

type Message = MessageTypeFactory<"chat_gpt_window">
type IncomingMessage = MessageTypeFactory<"cmdk">

export default function ChatGPT() {
  const portRef = useRef<chrome.runtime.Port | undefined>(undefined)
  const responseContainerRef = useRef<HTMLDivElement | undefined>(undefined)

  useEffect(() => {
    portRef.current = chrome.runtime.connect({ name: PORT_NAME })

    window.addEventListener('beforeunload', function() {
      portRef.current?.postMessage({
        source: "chat_gpt_window",
        payload: {
          type: "unregister_chat_gpt_tab"
        }
      } satisfies Message)
    });

    // register chat gpt tab
    portRef.current.postMessage({
      source: "chat_gpt_window",
      payload: {
        type: "register_chat_gpt_tab"
      }
    } as Message)

    portRef.current.onMessage.addListener(function (msg: IncomingMessage) {
      if (msg.source === "cmdk") {
        if (msg.payload.type === "send_chat_message") {
          chatgpt.sendMsg(msg.payload.payload.message)
        }
      }
    })

    const postMessage = throttle((message: Message) => {
      console.log('postMessage called')
      console.log(portRef.current);

      portRef.current?.postMessage(message)
    }, 200);


    const markdownObserver = new MutationObserver((mutations) => {
      postMessage({
        source: "chat_gpt_window",
        payload: {
          type: "chat_gpt_response",
          payload: {
            response_type: "html",
            html: responseContainerRef.current.innerHTML || ""
          }
        }
      } as Message)
    })

    const observer = new MutationObserver((mutations) => {
      // Loop through the mutations to check for changes in the number of divs with the 'markdown' class
      mutations.forEach((mutation) => {
        const addedNodes = Array.from(mutation.addedNodes)

        const addedDivs = addedNodes.filter((node) => {
          if (node.tagName !== "DIV") {
            return false
          }
          return (
            node.classList.contains("group") &&
            node.classList.contains("w-full") &&
            node.classList.contains("text-gray-800") &&
            node.classList.contains("dark:text-gray-100") &&
            node.classList.contains("border-b") &&
            node.classList.contains("border-black/10") &&
            node.classList.contains("dark:border-gray-900/50") &&
            node.classList.contains("bg-gray-50")
          )
        })

        if (addedDivs.length > 0) {
          responseContainerRef.current = addedDivs[0].querySelector(".markdown")

          portRef.current?.postMessage({
            source: "chat_gpt_window",
            payload: {
              type: "chat_gpt_response",
              payload: {
                response_type: "html",
                html: responseContainerRef.current?.innerHTML || ""
              }
            }
          } as Message)


          if (responseContainerRef.current) {
            markdownObserver.observe(responseContainerRef.current, {
              childList: true,
              subtree: true,
              characterData: true
            })
          }
        }
      })
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
  }, [])
  return null
}
