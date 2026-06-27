"use client"

/**
 * useRole — Hook client qui lit le rôle depuis le JWT stocké en cookie.
 * domaines : 'tech' = ADMIN, 'rh' = ADMIN_RH
 */

import { useMemo } from "react"

type Domain = "tech" | "rh"

function parseRoleFromCookie(): string {
  if (typeof document === "undefined") return "ADMIN"
  const raw = document.cookie
    .split("; ")
    .find(row => row.startsWith("apc_admin_session="))
    ?.split("=")[1]
  if (!raw) return "ADMIN"
  try {
    let payloadBase64 = raw.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const pad = payloadBase64.length % 4
    if (pad) payloadBase64 += "=".repeat(4 - pad)
    const payload = JSON.parse(atob(payloadBase64))
    return payload.role || "ADMIN"
  } catch {
    return "ADMIN"
  }
}

export function useRole() {
  const role = useMemo(() => parseRoleFromCookie(), [])
  const isAdmin   = role === "ADMIN"
  const isAdminRH = role === "ADMIN_RH"

  const canWrite = (domain: Domain): boolean => {
    if (domain === "tech") return isAdmin
    if (domain === "rh")   return isAdminRH
    return false
  }

  return { role, isAdmin, isAdminRH, canWrite }
}
