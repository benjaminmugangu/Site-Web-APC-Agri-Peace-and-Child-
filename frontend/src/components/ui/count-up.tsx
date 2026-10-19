"use client"

import { useMotionValue, useTransform, useSpring, motion } from "framer-motion"
import { useEffect } from "react"

interface CountUpProps {
  value: number | string
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 2, className = "" }: CountUpProps) {
  // Parser la valeur (ex: "15 000+" -> 15000)
  const numericValue = typeof value === 'string'
    ? parseInt(value.replace(/[^0-9]/g, '')) || 0
    : value

  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration })
  const displayValue = useTransform(spring, (latest) => Math.round(latest).toLocaleString('fr-FR'))

  useEffect(() => {
    motionValue.set(numericValue)
  }, [motionValue, numericValue])

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  )
}
