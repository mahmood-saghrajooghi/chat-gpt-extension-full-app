import { PORT_NAME } from "~port-name"
import { useEffect, useRef } from "react"
import chatgpt from "~modules/chatgpt/chatgpt"
import type { IncomingMessage, ChatGPTMessage } from "./types"
import throttle from "lodash/throttle"
import {
  getConversationId,
  isRequestCompleteMessage
} from "./handlers/onMessageComplete"
import trpc from "~lib/trpc"

export default function ChatGPT() {
  const portRef = useRef<chrome.runtime.Port | undefined>(undefined)
  const responseContainerRef = useRef<HTMLDivElement | undefined>(undefined)
  const messageIdRef = useRef<string | undefined>(undefined)

  const updateMessageConversationIdMutation =
    trpc.chat.updateMessageConversationId.useMutation()
  const createUpdateConversationMutation = trpc.chat.createOrUpdateConversation.useMutation()
  const messageResponseMutation = trpc.chat.messageResponse.useMutation()

  const conversationList = trpc.chat.listConversations.useQuery({
    userId: "64b41f7351551302654cf4a7"
  })

  useEffect(() => {
      console.log(conversationList.data)
  }, [conversationList.data])

  useEffect(() => {
    portRef.current = chrome.runtime.connect({ name: PORT_NAME })

    window.addEventListener("beforeunload", function () {
      portRef.current?.postMessage({
        source: "chat_gpt_window",
        payload: {
          type: "unregister_chat_gpt_tab"
        }
      } satisfies ChatGPTMessage)
    })

    // register chat gpt tab
    portRef.current.postMessage({
      source: "chat_gpt_window",
      payload: {
        type: "register_chat_gpt_tab"
      }
    } as ChatGPTMessage)

    portRef.current.onMessage.addListener(async function (
      msg: IncomingMessage
    ) {
      if (msg.source === "cmdk") {
        if (msg.payload.type === "send_chat_message") {
          messageIdRef.current = msg.payload.payload.messageId
          chatgpt.sendMsg(msg.payload.payload.message)
        }
      }

      if (isRequestCompleteMessage(msg)) {
        const conversationId = await getConversationId(msg)
        if (conversationId) {
          console.log('we are creating conversations');
          const conversation = await createUpdateConversationMutation.mutateAsync({
            conversationId: conversationId,
            userId: "64b41f7351551302654cf4a7",
          })
          updateMessageConversationIdMutation.mutate({
            id: messageIdRef.current,
            conversationId
          })
        }
      }
    })

    const postMessage = throttle((message: ChatGPTMessage) => {
      portRef.current?.postMessage(message)
      if (messageIdRef.current) {
        messageResponseMutation.mutate({
          messageId: messageIdRef.current,
          response: responseContainerRef.current?.innerHTML || ""
        })
      }
    }, 200)

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
      } as ChatGPTMessage)
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
          } as ChatGPTMessage)

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
