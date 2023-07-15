import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLProps
} from "react"

async function edit(node, text) {
  const overlap = getOverlap(node.textContent, text)
  await perform(node, [
    ...deleter(node.textContent, overlap),
    ...writer(text, overlap)
  ])
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function perform(node, edits, speed = 60) {
  for (const op of editor(edits)) {
    op(node)
    await wait(speed + speed * (Math.random() - 0.5))
  }
}

function* editor(edits): any {
  for (const edit of edits) {
    yield (node) => requestAnimationFrame(() => (node.textContent = edit))
  }
}

function* writer([...text], startIndex = 0, endIndex = text.length): any {
  while (startIndex < endIndex) {
    yield text.slice(0, ++startIndex).join("")
  }
}

function* deleter([...text], startIndex = 0, endIndex = text.length): any {
  while (endIndex > startIndex) {
    yield text.slice(0, --endIndex).join("")
  }
}

function getOverlap(start, [...end]) {
  return [...start, NaN].findIndex((char, i) => end[i] !== char)
}

async function type(node, ...args) {
  console.log("type", node, args);
  for (const arg of args) {
    switch (typeof arg) {
      case "string":
        await edit(node, arg)
        break
      case "number":
        await wait(arg)
        break
      case "function":
        await arg(node, ...args)
        break
      default:
        await arg
    }
  }
}

export const useTypical = (targetRef: React.MutableRefObject<any>) => {
  const update = useCallback(
    ({
      steps,
      loop
    }: {
      steps: (string | number | Function)[]
      loop: number
    }) => {
      if (loop === Infinity) {
        // type(targetRef.current, ...steps, loopedType);
      } else if (typeof loop === "number") {
        type(targetRef.current, ...Array(loop).fill(steps).flat())
      } else {
        type(targetRef.current, ...steps)
      }
    },
    []
  )
  return { update }
}

export default function Typical({
  children,
  ...props
}: { children: string } & HTMLProps<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>()
  const originalText = useMemo(() => children, [])
  const { update } = useTypical(ref)

  useEffect(() => {
    console.log("children", children);
    update({ steps: [children], loop: 1 })
  }, [children])

  return (
    <div {...props} ref={ref}>
      {originalText}
    </div>
  )
}
