type MessageSource = 'cmdk' | 'chat_gpt_window';

interface Payload extends Record<MessageSource, any> {
  cmdk: {
    type: 'send_chat_message';
    payload: {
      message: string;
    };
  } | {
    type: 'register_cmdk_tab';
  }
  chat_gpt_window: {
    type: 'chat_gpt_response';
    payload: {
      response_type: 'html';
      html: string;
    } | {
      response_type: 'text';
      text: string;
    };
  } | {
    type: 'register_chat_gpt_tab';
  }
}

export type Message<S extends MessageSource = MessageSource> = {
  source: S;
  payload: Payload[S];
}

export type MessageTypeFactory<S extends MessageSource> = Message<S>;
