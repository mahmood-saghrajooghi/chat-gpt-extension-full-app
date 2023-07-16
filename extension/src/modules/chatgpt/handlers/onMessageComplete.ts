import chatgpt from "../chatgpt"
import type { IncomingMessage } from "../types"
import { sleep } from "~lib/sleep"

export const isRequestCompleteMessage = async (msg: IncomingMessage) =>
  msg.source === "background" &&
  msg.payload.type === "background" &&
  msg.payload.payload.type === "request_status" &&
  msg.payload.payload.status === "complete"

export const getConversationId = async (msg: IncomingMessage) => {
  try {
    if (!window.location.href.includes("https://chat.openai.com/c/")) {
      setTimeout(async () => {
        const chatLinksContainer = chatgpt.getSidebarChatLinksContainer()
        const chatLinks = chatLinksContainer.querySelectorAll("a")
        chatLinks[1].click()
        await sleep(1000)
        const latestChatLink = chatgpt
          .getSidebarChatLinksContainer()
          .querySelector("a")
        latestChatLink.click()
        if (window.location.href.includes("https://chat.openai.com/c/")) {
          return window.location.pathname.split("/").pop()
        }
      }, 2000)
    } else {
      return window.location.pathname.split("/").pop()
    }
  } catch (e) {
    console.log(e)
  }
}
