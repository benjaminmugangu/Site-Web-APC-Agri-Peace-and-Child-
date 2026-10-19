"use client"

import { useState, useEffect, useRef } from "react"

interface CountUpProps {
  value: number | string
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 3, className = "" }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // Parser la valeur et détecter le suffixe (ex: "15 000+" -> 15000, suffixe: "+")
  const hasSuffix = typeof value === 'string' && value.includes('+')
  const numericValue = typeof value === 'string'
    ? parseInt(value.replace(/[^0-9]/g, '')) || 0
    : value

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

      setDisplayValue(Math.floor(progress * numericValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, numericValue, duration])

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString('fr-FR')}{hasSuffix && '+'}
    </span>
  )
}
