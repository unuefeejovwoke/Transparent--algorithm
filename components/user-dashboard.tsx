"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { postStorage } from "@/lib/posts"
import { User, TrendingUp, Heart, MessageSquare, Eye } from "lucide-react"

export function UserDashboard() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      const posts = postStorage.getPosts()
      const userPosts = posts.filter((p) => p.authorId === user.id)
      const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0)
      const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0)

      setUserStats({
        totalPosts: userPosts.length,
        totalLikes,
        totalComments,
        avgEngagement: userPosts.length > 0 ? ((totalLikes + totalComments) / userPosts.length).toFixed(1) : 0,
        topPost: userPosts.sort((a, b) => b.likes + b.comments.length - (a.likes + a.comments.length))[0],
      })

      // Mock recent activity data
      setRecentActivity([
        { type: "post", content: "Your post about AI transparency got 15 new likes", time: "2 hours ago", icon: Heart },
        {
          type: "comment",
          content: "Someone commented on your algorithm analysis",
          time: "4 hours ago",
          icon: MessageSquare,
        },
        { type: "view", content: "Your profile was viewed 8 times today", time: "6 hours ago", icon: Eye },
        {
          type: "engagement",
          content: "Your content reached 234 people this week",
          time: "1 day ago",
          icon: TrendingUp,
        },
      ])
    }
  }, [user])

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please sign in to view your dashboard</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Your Dashboard</h2>
        <Badge variant="secondary">{user.name}</Badge>
      </div>

      {/* User Stats Overview */}
      {userStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">Total published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalLikes}</div>
              <p className="text-xs text-muted-foreground">Across all posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalComments}</div>
              <p className="text-xs text-muted-foreground">Total received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.avgEngagement}</div>
              <p className="text-xs text-muted-foreground">Per post</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="algorithm">Your Algorithm Profile</TabsTrigger>
          <TabsTrigger value="insights">Content Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.content}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithm">
          <Card>
            <CardHeader>
              <CardTitle>Your Algorithm Profile</CardTitle>
              <CardDescription>How the algorithm sees and ranks your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Content Quality Score</span>
                    <Badge variant="outline">8.5/10</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Based on engagement rates and user feedback</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Audience Reach</span>
                    <Badge variant="outline">7.2/10</Badge>
                  </div>
                  <Progress value={72} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">How widely your content is distributed</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Consistency Score</span>
                    <Badge variant="outline">6.8/10</Badge>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Regular posting and engagement patterns</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Algorithm Recommendations</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Post during peak hours (12-2 PM, 7-9 PM) for better reach</li>
                  <li>• Include more interactive elements to boost engagement</li>
                  <li>• Your transparency-focused content performs 40% better</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance Insights</CardTitle>
              <CardDescription>Detailed analysis of your content performance</CardDescription>
            </CardHeader>
            <CardContent>
              {userStats?.topPost && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Your Top Performing Post</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      "{userStats.topPost.content.substring(0, 100)}..."
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {userStats.topPost.likes} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {userStats.topPost.comments.length} comments
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">What's Working</h4>
                      <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                        <li>• Educational content gets 2x more engagement</li>
                        <li>• Posts with questions drive more comments</li>
                        <li>• Transparency topics resonate with your audience</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Opportunities</h4>
                      <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                        <li>• Try posting videos for higher engagement</li>
                        <li>• Engage more with comments on your posts</li>
                        <li>• Consider posting more frequently</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
