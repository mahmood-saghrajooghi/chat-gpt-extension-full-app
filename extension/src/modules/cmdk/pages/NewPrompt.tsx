import { forwardRef } from "react"

const NewPrompt = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      id="result-container"
      className="chatgpt-response-container text-sm"
      ref={ref}></div>
  )
})

export default NewPrompt
