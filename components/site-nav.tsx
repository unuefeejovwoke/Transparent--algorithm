"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"

export default function SiteNav() {
  const { isAuthenticated, logout, isLoading } = useAuth()

  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Avoid a flash while hydrating
    return (
      <nav className="flex items-center gap-2">
        <Button variant="ghost" asChild><a href="/dashboard">Dashboard</a></Button>
        <Button variant="outline" disabled>Sign in</Button>
      </nav>
    )
  }

  return (
    <>
      <nav className="flex items-center gap-2">
        <Button variant="ghost" asChild><a href="/dashboard">Dashboard</a></Button>

        {isAuthenticated ? (
          <Button onClick={logout}>Log out</Button>
        ) : (
          <>
            {/* You can use the modal, or swap this for <a href="/auth"> */}
            <Button variant="outline" onClick={() => setOpen(true)}>Sign in</Button>
          </>
        )}
      </nav>

      <AuthModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
