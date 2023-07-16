import cssText from "data-text:~style.css"
import stylesText from "data-text:~modules/cmdk/cmdk-compiled.css"
import cubeStylesText from "data-text:~modules/cmdk/components/cube/cube.css"

import type { PlasmoCSConfig } from "plasmo"

import Cmdk from "~modules/cmdk"
import ChatGPT from "~modules/chatgpt"

import "~base.css"
import RootProvider from "~providers"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText + stylesText + cubeStylesText
  return style
}

const PlasmoOverlay = () => (
  <RootProvider>
    {window.location.hostname === "chat.openai.com" ? <ChatGPT /> : <Cmdk />}
  </RootProvider>
)

export default PlasmoOverlay
