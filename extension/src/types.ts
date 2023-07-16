type MessageSource = "cmdk" | "chat_gpt_window" | "background"
type RequestStatus = "loading" | "complete"
export type ChatGPTTabStatus = "active" | "not_active"
interface Payload extends Record<MessageSource, any> {
  cmdk:
    | {
        type: "send_chat_message"
        payload: {
          message: string;
          messageId: string;
        }
      }
    | {
        type: "register_cmdk_tab"
      }
  chat_gpt_window:
    | {
        type: "chat_gpt_response"
        payload: {
          response_type: "html"
          html: string
        }
      }
    | {
        type: "register_chat_gpt_tab"
      }
    | {
        type: "unregister_chat_gpt_tab"
      }
    | {
        type: "set_conversation_id"
        payload: {
          conversation_id: string
        }
      }
  background:
    | {
        type: "background"
        payload: {
          type: "request_status"
          status: RequestStatus
        }
      }
    | {
        type: "background"
        payload: {
          type: "chat_gpt_tab_status"
          status: ChatGPTTabStatus
        }
      }
}

export type Message<S extends MessageSource = MessageSource> = {
  source: S
  payload: Payload[S]
}

export type MessageTypeFactory<S extends MessageSource> = Message<S>
