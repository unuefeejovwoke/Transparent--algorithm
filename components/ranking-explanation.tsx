"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Info, Clock, Heart, Users, TrendingUp, X } from "lucide-react"
import type { Post } from "@/lib/posts"

interface RankingExplanationProps {
  post: Post
  onClose: () => void
}

type FactorKey = "recency" | "engagement" | "affinity" | "trending"

const WEIGHTS: Record<FactorKey, number> = {
  recency: 35,
  engagement: 30,
  affinity: 20,
  trending: 15,
}

function timeSince(ts: string): string {
  const now = new Date()
  const then = new Date(ts)
  const diffMs = now.getTime() - then.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours < 1) {
    const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)))
    return `${minutes} min ago`
  }
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}

export function RankingExplanation({ post, onClose }: RankingExplanationProps) {
  const [showDetails, setShowDetails] = useState(false)

  const scores = useMemo(() => {
    const now = new Date()
    const postTime = new Date(post.timestamp)
    const hoursAgo = (now.getTime() - postTime.getTime()) / (1000 * 60 * 60)

    const recency = post.factors?.recency ?? Math.max(0, Math.round(100 - hoursAgo * 5))
    const engagement =
      post.factors?.engagement ?? Math.min(100, Math.round((post.likes.length * 2 + post.comments.length * 3) * 2))
    const affinity = post.factors?.affinity ?? 50
    const trending =
      post.factors?.trending ?? Math.min(100, Math.round(post.shares * 10 + (post.factors?.engagement ?? engagement) * 0.5))

    return { recency, engagement, affinity, trending }
  }, [post])

  const factors = [
    {
      key: "recency" as const,
      name: "Recency",
      score: scores.recency,
      weight: WEIGHTS.recency,
      explanation: `Posted ${timeSince(post.timestamp)}`,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      key: "engagement" as const,
      name: "Engagement Rate",
      score: scores.engagement,
      weight: WEIGHTS.engagement,
      explanation: `${post.likes.length} likes and ${post.comments.length} comments show engagement`,
      icon: Heart,
      color: "text-red-600",
    },
    {
      key: "affinity" as const,
      name: "User Affinity",
      score: scores.affinity,
      weight: WEIGHTS.affinity,
      explanation: "Based on your interaction history with this creator",
      icon: Users,
      color: "text-green-600",
    },
    {
      key: "trending" as const,
      name: "Trending Score",
      score: scores.trending,
      weight: WEIGHTS.trending,
      explanation: `${post.shares} shares indicate growing momentum`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const overallScore = Number(
    factors.reduce((sum, f) => sum + (f.score * f.weight) / 100, 0).toFixed(1)
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Why This Post Ranked #{post.algorithmScore ? Math.floor(post.algorithmScore) : "N/A"}
            </CardTitle>
            <CardDescription>Detailed breakdown of ranking factors</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-3xl font-bold text-primary">{overallScore.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">Overall Algorithm Score</div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Ranking Factor Breakdown</h4>
          {factors.map((factor) => {
            const Icon = factor.icon
            const contribution = ((factor.score * factor.weight) / 100).toFixed(1)

            return (
              <div key={factor.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${factor.color}`} />
                    <span className="font-medium text-sm">{factor.name}</span>
                    <Badge variant="outline">{factor.weight}% weight</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">+{contribution} points</div>
                    <div className="text-xs text-muted-foreground">{factor.score}/100</div>
                  </div>
                </div>

                <Progress value={factor.score} className="h-2" />

                <div className="text-xs text-muted-foreground">{factor.explanation}</div>
              </div>
            )
          })}
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowDetails((v) => !v)}>
          {showDetails ? "Hide Additional Context" : "Show Additional Context"}
        </Button>

        {showDetails && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Signals We Used</h5>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                <li>• Time of day of posting</li>
                <li>• Recent likes and comments</li>
                <li>• Your interaction history with the author</li>
                <li>• Shares and momentum</li>
              </ul>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">How To Improve</h5>
              <ul className="text-green-700 dark:text-green-300 space-y-1 text-sm">
                <li>• Post during your peak hours</li>
                <li>• Encourage early comments</li>
                <li>• Reply to first 3 to 5 comments</li>
                <li>• Ask engaged followers to share</li>
              </ul>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
          <strong>Transparency Note:</strong> This ranking explanation is generated in real time based on current
          algorithm weights and your personal interaction history. Rankings may change as new interactions occur.
        </div>
      </CardContent>
    </Card>
  )
}
