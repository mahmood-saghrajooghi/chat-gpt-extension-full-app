import { PORT_NAME } from '~port-name';
import { Message } from '~types';

// eslint-disable-next-line no-var
var chatGPTTabId: number | undefined;
// eslint-disable-next-line no-var
var chatGPTPort: chrome.runtime.Port | undefined;
// eslint-disable-next-line no-var
var cmdkTabId: number | undefined;
// eslint-disable-next-line no-var
var cmdkPort: chrome.runtime.Port | undefined;

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg: Message) {
    if (port.name !== PORT_NAME) {
      return;
    }

    console.log('🔥', msg);

    switch (msg.source) {
      case 'cmdk':
        if (msg.payload.type === 'register_cmdk_tab') {
          cmdkTabId = port.sender?.tab?.id;
          cmdkPort = port;
          return;
        }
        if (msg.payload.type === 'send_chat_message') {
          if (chatGPTTabId) {
            console.log('👺', chatGPTPort);

            chatGPTPort?.postMessage(msg);
          }
        }
        break;
      case 'chat_gpt_window':
        console.log('🌊', msg);

        if (msg.payload.type === 'register_chat_gpt_tab') {
          chatGPTPort = port;
          chatGPTTabId = port.sender?.tab?.id;
          return;
        }

        if (msg.payload.type === 'chat_gpt_response') {
          console.log('🚀', msg);
          if (cmdkTabId) {
            cmdkPort?.postMessage(msg);
            return;
          }
        }
        break;
    }
  });
});
