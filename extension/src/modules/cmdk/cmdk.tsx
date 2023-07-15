import { useCallback, useEffect, useRef, useState } from "react"
import Mousetrap from "mousetrap"

import { PAGES } from "~modules/cmdk/modules/navigation/context"
import useInput from "~modules/cmdk/modules/input/useInput"
import { useNavigation } from "~modules/cmdk/modules/navigation/useNavigation"
import type { MessageTypeFactory } from "~types"
import { PORT_NAME } from "~/port-name"

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandSeparator
} from "~/modules/cmdk/command"
import Route from "~modules/cmdk/modules/navigation/components/Route"
import Home from "~modules/cmdk/pages/Home"
import NewPrompt from "~modules/cmdk/pages/NewPrompt"

type Message = MessageTypeFactory<"cmdk">
type IncomingMessage = MessageTypeFactory<"chat_gpt_window">

const hotKeys = ["meta+shift+l"]

function App() {
  const ref = useRef<HTMLDivElement | null>(null)
  const portRef = useRef<chrome.runtime.Port | null>(null)
  const resultContainerRef = useRef<HTMLDivElement | null>(null)

  const [inputValue, setInputValue] = useState("linear")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const inputRef = useInput()
  const { pop, activePage } = useNavigation()

  const toggleModal = () => {
    setIsModalOpen((c) => !c)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = "scale(0.96)"
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = ""
        }
      }, 100)

      setInputValue("")
    }
  }

  const onEnterHandler = useCallback(() => {
    if (activePage === PAGES.NEW_PROMPT) {
      const message: Message = {
        source: "cmdk",
        payload: {
          type: "send_chat_message",
          payload: {
            message: inputValue
          }
        }
      }
      console.log("🔥", message)

      portRef.current?.postMessage(message)
      return
    }
  }, [activePage, inputValue])

  const inputKeyDownHandler = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          bounce()
          onEnterHandler()
        }
      }

      if (e.key === "Escape" || (e.key === "l" && e.metaKey && e.shiftKey)) {
        handleCloseModal()
      }

      if (activePage === PAGES.HOME || inputValue.length) {
        return
      }

      if (
        (e.key === "Backspace" && inputValue.length === 0) ||
        (e.key === "Backspace" && e.metaKey)
      ) {
        e.preventDefault()
        pop()
        console.log("about to bounce")
        bounce()
      }
    },
    [activePage, inputValue, pop]
  )

  useEffect(() => {
    inputRef?.current?.focus()
    portRef.current = chrome.runtime.connect({ name: PORT_NAME })
    const message: Message = {
      source: "cmdk",
      payload: {
        type: "register_cmdk_tab"
      }
    }
    portRef.current.postMessage(message)

    portRef.current.onMessage.addListener(function (msg: IncomingMessage) {
      // console.log({ msg });

      if (msg.source !== "chat_gpt_window") return
      if (msg.payload.type !== "chat_gpt_response") return

      console.log({ resultContainerRef })

      if (!resultContainerRef.current) return

      if (msg.payload.payload.response_type === "html") {
        console.log("here")
        resultContainerRef.current.innerHTML = `<div class="p-3">${msg.payload.payload.html}</div>`
      }

      if (msg.payload.payload.response_type === "text") {
        const lastchild =
          resultContainerRef.current.querySelector(":last-child")
        if (lastchild) {
          lastchild.innerHTML = msg.payload.payload.text
        }
      }
    })
  }, [])

  useEffect(() => {
    Mousetrap.bind(hotKeys, () => {
      toggleModal()
    })

    Mousetrap.bind("esc", handleCloseModal)

    return () => {
      Mousetrap.unbind(hotKeys)
      Mousetrap.unbind("esc")
    }
  }, [])

  if (!isModalOpen) return null

  return (
    <div className="raycast dark fixed top-64 left-1/2 -translate-x-1/2 z-50">
      <Command
        ref={ref}
        onKeyDown={inputKeyDownHandler}
        className="rounded-lg border shadow-md bg-neutral-950 text-gray-300 w-[640px] max-h-[800px] overflow-hidden text-sm">
        <CommandInput
          ref={inputRef}
          onValueChange={(value) => setInputValue(value)}
          autoFocus
          className="overflow-y-auto overflow-x-hidden"
          maxRows={10}
          placeholder="Send a message..."
        />
        <CommandSeparator />
        <Route page={PAGES.HOME} component={Home} />
        <Route
          page={PAGES.NEW_PROMPT}
          component={NewPrompt}
          ref={resultContainerRef}
        />
      </Command>
    </div>
  )
}

// used classnames for the content
// group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654] flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto flex-shrink-0 flex flex-col relative items-end w-[30px] relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center h-6 w-6 text-xs flex items-center justify-center gap-1 invisible absolute left-0 top-2 -ml-4 -translate-x-full group-hover:visible !invisible dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400 h-3 w-3 flex-grow flex-shrink-0 dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400 h-3 w-3 relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)] flex flex-grow flex-col gap-3 min-h-[20px] flex items-start overflow-x-auto whitespace-pre-wrap break-words flex-col gap-4 markdown prose w-full break-words dark:prose-invert light bg-black rounded-md mb-4 flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md flex ml-auto gap-2 h-4 w-4 p-4 overflow-y-auto !whitespace-pre hljs language-javascript hljs-comment hljs-keyword hljs-title function_ hljs-string hljs-comment hljs-keyword hljs-string hljs-string hljs-comment hljs-variable language_ hljs-title function_ flex justify-between lg:block text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-2 md:gap-3 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible flex ml-auto gap-2 rounded-md p-1 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 h-4 w-4 flex gap-1 p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 h-4 w-4 p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 h-4 w-4

export default App
