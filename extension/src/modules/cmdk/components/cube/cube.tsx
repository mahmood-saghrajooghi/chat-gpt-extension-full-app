"use client"

import React, { useEffect, useRef } from "react"
import type { ThemeColor } from "./ThemeTypes"
import themeColors from "./theme-colors.config"

export const AnimatedCube: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    css?: Interpolation<Theme>
    cubeSize?: number
    cubeScale?: number
    borderWidth?: number
    borderWidth1?: number
    shouldAnimate?: boolean
    theme?: ThemeColor
  }
> = ({
  className,
  css,
  cubeSize,
  borderWidth,
  borderWidth1,
  shouldAnimate,
  theme,
  cubeScale,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const cssObj: Record<string, string> = {}
  useEffect(() => {
    if (ref.current) {
      if (cubeScale) {
        ref.current.style.setProperty("--cubeScale", `${cubeScale}px`)
      }
      if (cubeSize) {
        ref.current.style.setProperty("--cubeSize", `${cubeSize}px`)
      }
      if (theme) {
        ref.current.style.setProperty(
          "--outerCubeColor",
          themeColors[`timem-${theme}`][100]
        )
        ref.current.style.setProperty(
          "--outerCubeColor-dim",
          themeColors[`timem-${theme}`][200]
        )
        ref.current.style.setProperty(
          "--outerCubeColor-dimer",
          themeColors[`timem-${theme}`][300]
        )
        ref.current.style.setProperty(
          "--borderColor",
          themeColors[`timem-${theme}`][900]
        )
      }
      if (!shouldAnimate) {
        ref.current.style.setProperty("--animationIterationCount", "1")
      }
      if (borderWidth) {
        ref.current.style.setProperty("--borderWidth", `${borderWidth}px`)
      }
      if (borderWidth1) {
        ref.current.style.setProperty("--borderWidth1", `${borderWidth1}px`)
      }
    }
  }, [cubeScale, cubeSize, theme, shouldAnimate, borderWidth, borderWidth1])

  return (
    <div className="scene-container">
      <div className={`scene ${className}`} {...props} ref={ref}>
        <div className="webpack-cube">
          <div className="outer-cube">
            <div className="face face-top">
              <span></span>
            </div>
            <div className="face face-left">
              <span></span>
            </div>
            <div className="face face-right">
              <span></span>
            </div>
            <div className="face face-front">
              <span></span>
            </div>
            <div className="face face-back">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
