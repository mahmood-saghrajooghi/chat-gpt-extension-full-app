import { forwardRef } from "react"

const NewPrompt = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      id="result-container"
      className="chatgpt-response-container text-sm overflow-y-auto overflow-x-hidden"
      ref={ref} />
  )
})

export default NewPrompt
