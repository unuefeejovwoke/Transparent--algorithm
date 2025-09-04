"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

export default function AuthScreen({ defaultMode = "login" as "login" | "signup" }) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode)

  return mode === "login" ? (
    <>
      <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
      <LoginForm onToggleMode={() => setMode("signup")} />
    </>
  ) : (
    <>
      <h1 className="mb-4 text-xl font-semibold">Create account</h1>
      <SignupForm onToggleMode={() => setMode("login")} />
    </>
  )
}
