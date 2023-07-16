import type { MessageTypeFactory } from "../../types"

export type ChatGPTMessage = MessageTypeFactory<"chat_gpt_window">
export type IncomingMessage =
  | MessageTypeFactory<"cmdk">
  | MessageTypeFactory<"background">
