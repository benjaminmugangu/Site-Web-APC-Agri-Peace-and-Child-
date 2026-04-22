"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, AlertCircle, Leaf } from "lucide-react"
import { Suspense } from "react"

const CREDENTIALS = {
  email: "admin@apc.org",
  password: "apc2024",
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("from") ?? "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulation d'un délai réseau
    await new Promise((res) => setTimeout(res, 800))

    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      // Définir le cookie de session (expire dans 24h)
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `apc_admin_session=authenticated; path=/; expires=${expires}; SameSite=Lax`
      router.push(redirectTo)
      router.refresh()
    } else {
      setError("Identifiants incorrects. Vérifiez votre email et mot de passe.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-apc-green shadow-lg mb-4">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Espace Admin</h1>
        <p className="text-white/60 text-sm">
          Agri-Peace and Child — Accès réservé aux collaborateurs
        </p>
      </div>

      {/* Card de connexion */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Erreur */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/20 border border-red-400/30 text-red-200 rounded-xl px-4 py-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium block">
              Adresse Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@apc.org"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-apc-greenLight/50 focus:border-apc-greenLight/50 transition-all"
            />
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium block">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-apc-greenLight/50 focus:border-apc-greenLight/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bouton */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-apc-green hover:bg-green-700 text-white font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-apc-green/30"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          Accès réservé — Ne partagez pas vos identifiants
        </p>
      </div>

      {/* Aide */}
      <p className="text-center text-white/30 text-xs mt-6">
        Problème de connexion ?{" "}
        <a href="mailto:agripeaceandchild@gmail.com" className="underline hover:text-white/60 transition-colors">
          Contacter le support
        </a>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0d2616] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#1a472a_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#2d6a4f_0%,transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apc-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-apc-greenLight/5 rounded-full blur-3xl" />

      {/* Grille subtile */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Formulaire */}
      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
