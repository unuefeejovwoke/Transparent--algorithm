"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { adminConfigStorage } from "@/lib/admin-config"
import { AlgorithmConfigPanel } from "./algorithm-config-panel"
import { ContentModerationPanel } from "./content-moderation-panel"
import { UserManagementPanel } from "./user-management-panel"
import { Users, MessageSquare, Heart, TrendingUp, Shield } from "lucide-react"

export function AdminDashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    if (user?.role === "admin") {
      const data = adminConfigStorage.getAnalytics()
      setAnalytics(data)
    }
  }, [user])

  if (!user || user.role !== "admin") {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Admin access required</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Badge variant="secondary">Administrator</Badge>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+{analytics.recentUsers} in 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalPosts}</div>
              <p className="text-xs text-muted-foreground">+{analytics.recentPosts} in 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalLikes + analytics.totalComments}</div>
              <p className="text-xs text-muted-foreground">Likes + Comments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgEngagement}</div>
              <p className="text-xs text-muted-foreground">Per post</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Controls */}
      <Tabs defaultValue="algorithm" className="space-y-4">
        <TabsList>
          <TabsTrigger value="algorithm">Algorithm Config</TabsTrigger>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="algorithm">
          <AlgorithmConfigPanel />
        </TabsContent>

        <TabsContent value="moderation">
          <ContentModerationPanel />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
