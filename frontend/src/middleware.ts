import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE = "apc_admin_session"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Toujours autoriser la page de connexion elle-même
  if (pathname === "/admin/login") {
    const response = NextResponse.next()
    response.headers.set("x-pathname", pathname)
    return response
  }

  // Vérifier si la session est présente pour toutes les autres routes admin
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get(SESSION_COOKIE)

    if (!session?.value) {
      // Rediriger vers la page de connexion en conservant l'URL de destination
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Décoder basiquement le JWT pour récupérer le rôle
    try {
      let payloadBase64 = session.value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const pad = payloadBase64.length % 4
      if (pad) payloadBase64 += '='.repeat(4 - pad)
      const payloadString = atob(payloadBase64)
      const payload = JSON.parse(payloadString)
      const role = payload.role || 'ADMIN'

      // Routes réservées exclusivement à l'ADMIN (zéro accès pour ADMIN_RH)
      const adminOnlyRoutes = [
        '/admin/utilisateurs',
        '/admin/parametres',
      ]

      if (role === 'ADMIN_RH') {
        // ADMIN_RH n'a pas accès aux routes admin-only
        if (adminOnlyRoutes.some(r => pathname.startsWith(r))) {
          return NextResponse.redirect(new URL("/admin/emplois", request.url))
        }
        // Rediriger /admin (dashboard) vers sa section RH
        if (pathname === '/admin' || pathname === '/admin/') {
          return NextResponse.redirect(new URL("/admin/emplois", request.url))
        }
      }
      // ADMIN peut accéder à tout — la restriction lecture/écriture est gérée côté page
    } catch (e) {
      // En cas d'erreur de parsing, on laisse passer, l'API bloquera si token invalide
    }
  }

  // Injecter le pathname et le rôle dans les headers pour le layout (Server Component)
  const response = NextResponse.next()
  response.headers.set("x-pathname", pathname)
  
  const session = request.cookies.get(SESSION_COOKIE)
  if (session?.value) {
    try {
      let payloadBase64 = session.value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const pad = payloadBase64.length % 4
      if (pad) payloadBase64 += '='.repeat(4 - pad)
      const payload = JSON.parse(atob(payloadBase64))
      if (payload.role) {
        response.headers.set("x-user-role", payload.role)
      }
    } catch(e) {}
  }
  
  return response
}

export const config = {
  // S'applique uniquement aux routes /admin
  matcher: ["/admin/:path*"],
}
