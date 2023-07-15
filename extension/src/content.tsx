import cssText from "data-text:~style.css"
import stylesText from "data-text:~modules/cmdk/cmdk-compiled.css"

import type { PlasmoCSConfig } from "plasmo"

import Cmdk from "~modules/cmdk"
import ChatGPT from "~modules/chatgpt"

import "~base.css"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText + stylesText;
  return style
}

const PlasmoOverlay = () => {
  if (window.location.hostname === "chat.openai.com") {
    return <ChatGPT />
  }
  return <Cmdk />;
}

export default PlasmoOverlay
