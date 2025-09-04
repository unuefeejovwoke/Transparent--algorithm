"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Info, Clock, Heart, Users, TrendingUp, X } from "lucide-react"
import type { Post } from "@/lib/posts"

interface RankingExplanationProps {
  post: Post
  onClose: () => void
}

export function RankingExplanation({ post, onClose }: RankingExplanationProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Calculate individual factor scores (mock calculation for demo)
  const factors = [
    {
      name: "Recency",
      score: 85,
      weight: 35,
      explanation: "Posted 2 hours ago during peak activity time",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      name: "Engagement Rate",
      score: 92,
      weight: 30,
      explanation: `${post.likes} likes and ${post.comments.length} comments show high engagement`,
      icon: Heart,
      color: "text-red-600",
    },
    {
      name: "User Affinity",
      score: 78,
      weight: 20,
      explanation: "You've interacted with this creator 3 times this week",
      icon: Users,
      color: "text-green-600",
    },
    {
      name: "Trending Score",
      score: 65,
      weight: 15,
      explanation: "Content is gaining momentum with 15% increase in interactions",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const overallScore = factors.reduce((sum, factor) => sum + (factor.score * factor.weight) / 100, 0)

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
        {/* Overall Score */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-3xl font-bold text-primary">{overallScore.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">Overall Algorithm Score</div>
        </div>

        {/* Factor Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium">Ranking Factor Breakdown</h4>
          {factors.map((factor) => {
            const Icon = factor.icon
            const contribution = ((factor.score * factor.weight) / 100).toFixed(1)

            return (
              <div key={factor.name} className="space-y-2">
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
                <p className="text-xs text-muted-foreground">{factor.explanation}</p>
              </div>
            )
          })}
        </div>

        {/* Additional Context */}
        <div className="space-y-3">
          <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="w-full">
            {showDetails ? "Hide" : "Show"} Additional Context
          </Button>

          {showDetails && (
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Personalization Factors</h5>
                <ul className="text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Your interest in "{post.type}" content: High</li>
                  <li>• Time of day preference match: 85%</li>
                  <li>• Similar content engagement history: Above average</li>
                </ul>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Community Signals</h5>
                <ul className="text-green-600 dark:text-green-400 space-y-1">
                  <li>• Positive sentiment in comments: 92%</li>
                  <li>• Share-to-view ratio: 12% (above average)</li>
                  <li>• Time spent reading: 2.3x longer than average</li>
                </ul>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Content Quality Indicators</h5>
                <ul className="text-yellow-600 dark:text-yellow-400 space-y-1">
                  <li>• Original content (not repost): +10 points</li>
                  <li>• Educational value detected: +8 points</li>
                  <li>• Appropriate length for topic: +5 points</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
          <strong>Transparency Note:</strong> This ranking explanation is generated in real-time based on current
          algorithm weights and your personal interaction history. Rankings may change as new interactions occur.
        </div>
      </CardContent>
    </Card>
  )
}
