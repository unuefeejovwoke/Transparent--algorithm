"use client"

import { AlgorithmDashboard } from "@/components/algorithm-dashboard"
import { EngagementAnalytics } from "@/components/engagement-analytics"
import { TransparencyPanel } from "@/components/transparency-panel"
import { ContentFeed } from "@/components/content-feed"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { UserDashboard } from "@/components/user-dashboard"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/auth-context"
import { initializeSamplePosts } from "@/lib/posts"
import { initializeDefaultUsers } from "@/lib/auth"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"
import HomeIcon from "lucide-react/dist/esm/icons/home"

export default function DashboardPage() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<"feed" | "dashboard">("feed")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initializeDefaultUsers()
    initializeSamplePosts()
    setReady(true)
  }, [])

  if (!ready) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transparent Social Algorithm</h1>
              <p className="text-muted-foreground mt-2">
                Understanding and analyzing engagement patterns with full transparency
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={currentView === "feed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("feed")}
                  >
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Feed
                  </Button>
                  <Button
                    variant={currentView === "dashboard" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentView("dashboard")}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </div>
              )}
              <Button variant="outline" asChild><a href="/">Home</a></Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {user?.role === "admin" && (
          <div className="mb-8">
            <AdminDashboard />
          </div>
        )}

        {currentView === "dashboard" && user ? (
          <UserDashboard />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <ContentFeed />
              </div>
              <div className="space-y-6">
                <AlgorithmDashboard />
                <TransparencyPanel />
              </div>
            </div>
            <div className="mt-12">
              <EngagementAnalytics />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
