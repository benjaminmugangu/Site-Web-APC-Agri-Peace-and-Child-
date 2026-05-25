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
      const payloadBase64 = session.value.split('.')[1]
      const payloadString = Buffer.from(payloadBase64, 'base64').toString()
      const payload = JSON.parse(payloadString)
      const role = payload.role || 'ADMIN'

      const isHRRoute = pathname.startsWith('/admin/emplois') || 
                        pathname.startsWith('/admin/candidatures') || 
                        pathname.startsWith('/admin/appels-d-offres') || 
                        pathname.startsWith('/admin/equipe')

      if (role === 'ADMIN_RH') {
        // ADMIN_RH n'a accès qu'aux routes RH et au Dashboard (optionnel)
        if (!isHRRoute && pathname !== '/admin') {
          return NextResponse.redirect(new URL("/admin/emplois", request.url))
        }
        // Si page d'accueil de l'admin, on le redirige vers sa section
        if (pathname === '/admin' || pathname === '/admin/') {
          return NextResponse.redirect(new URL("/admin/emplois", request.url))
        }
      } else {
        // ADMIN (Tech) n'a pas accès aux routes RH
        if (isHRRoute) {
          return NextResponse.redirect(new URL("/admin/utilisateurs", request.url))
        }
      }
    } catch (e) {
      // En cas d'erreur de parsing, on laisse passer, l'API bloquera si token invalide
    }
  }

  // Injecter le pathname dans les headers pour le layout (Server Component)
  const response = NextResponse.next()
  response.headers.set("x-pathname", pathname)
  return response
}

export const config = {
  // S'applique uniquement aux routes /admin
  matcher: ["/admin/:path*"],
}
