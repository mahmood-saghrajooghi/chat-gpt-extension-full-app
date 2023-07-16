import { PORT_NAME } from "~port-name"
import type { Message } from "~types"

// eslint-disable-next-line no-var
var chatGPTTabId: number | undefined
// eslint-disable-next-line no-var
var chatGPTPort: chrome.runtime.Port | undefined
// eslint-disable-next-line no-var
var cmdkTabId: number | undefined
// eslint-disable-next-line no-var
var cmdkPort: chrome.runtime.Port | undefined

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg: Message) {
    if (port.name !== PORT_NAME) {
      return
    }

    switch (msg.source) {
      case "cmdk":
        if (msg.payload.type === "register_cmdk_tab") {
          cmdkTabId = port.sender?.tab?.id
          cmdkPort = port
          if (chatGPTTabId) {
            cmdkPort?.postMessage({
              source: "background",
              payload: {
                type: "background",
                payload: {
                  type: "chat_gpt_tab_status",
                  status: "active"
                }
              }
            } satisfies Message)
          }
          return
        }
        if (msg.payload.type === "send_chat_message") {
          if (chatGPTTabId) {
            console.log("👺", chatGPTPort)

            chatGPTPort?.postMessage(msg)
          }
        }
        break
      case "chat_gpt_window":
        if (msg.payload.type === "register_chat_gpt_tab") {
          chatGPTPort = port
          chatGPTTabId = port.sender?.tab?.id
          // conversation complete
          cmdkPort?.postMessage({
            source: "background",
            payload: {
              type: "background",
              payload: {
                type: "chat_gpt_tab_status",
                status: "active"
              }
            }
          } satisfies Message)
          chrome.webRequest.onCompleted.addListener(
            () => {
              const message: Message = {
                source: "background",
                payload: {
                  type: "background",
                  payload: {
                    type: "request_status",
                    status: "complete"
                  }
                }
              }
              cmdkPort?.postMessage(message)
              chatGPTPort?.postMessage(message)
            },
            { urls: ["https://chat.openai.com/backend-api/conversation"] }
          )
          return
        }

        if (msg.payload.type === "unregister_chat_gpt_tab") {
          chatGPTTabId = undefined
          chatGPTPort = undefined
          cmdkPort?.postMessage({
            source: "background",
            payload: {
              type: "background",
              payload: {
                type: "chat_gpt_tab_status",
                status: "not_active"
              }
            }
          } satisfies Message)
          return
        }

        if (msg.payload.type === "chat_gpt_response") {
          console.log("🚀", msg)
          if (cmdkTabId) {
            cmdkPort?.postMessage(msg)
            return
          }
        }

        break
    }
  })
})
