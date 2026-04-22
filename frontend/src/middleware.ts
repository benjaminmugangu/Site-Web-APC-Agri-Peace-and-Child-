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
