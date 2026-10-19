"use client"

import { useMotionValue, useTransform, useSpring, motion, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

interface CountUpProps {
  value: number | string
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 2, className = "" }: CountUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Parser la valeur (ex: "15 000+" -> 15000)
  const numericValue = typeof value === 'string'
    ? parseInt(value.replace(/[^0-9]/g, '')) || 0
    : value

  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration })
  const displayValue = useTransform(spring, (latest) => Math.round(latest).toLocaleString('fr-FR'))

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue)
    }
  }, [motionValue, numericValue, isInView])

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  )
}
