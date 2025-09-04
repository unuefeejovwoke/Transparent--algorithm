"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-6">
        {mode === "login" ? (
          <>
            <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
            <LoginForm onToggleMode={() => setMode("signup")} />
          </>
        ) : (
          <>
            <h1 className="mb-4 text-xl font-semibold">Create account</h1>
            <SignupForm onToggleMode={() => setMode("login")} />
          </>
        )}
      </div>
    </main>
  )
}
