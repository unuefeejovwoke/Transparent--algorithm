"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Clock, Heart } from "lucide-react"

export function AlgorithmDashboard() {
  const algorithmFactors = [
    {
      name: "Recency",
      weight: 35,
      description: "How recently the content was posted",
      icon: Clock,
      color: "bg-blue-500",
    },
    {
      name: "Engagement Rate",
      weight: 30,
      description: "Likes, comments, and shares per view",
      icon: Heart,
      color: "bg-red-500",
    },
    {
      name: "User Affinity",
      weight: 20,
      description: "Your past interactions with this creator",
      icon: Users,
      color: "bg-green-500",
    },
    {
      name: "Trending Score",
      weight: 15,
      description: "How viral the content is becoming",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Algorithm Factors
        </CardTitle>
        <CardDescription>How we rank content in your feed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {algorithmFactors.map((factor) => {
          const Icon = factor.icon
          return (
            <div key={factor.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{factor.name}</span>
                </div>
                <Badge variant="secondary">{factor.weight}%</Badge>
              </div>
              <Progress value={factor.weight} className="h-2" />
              <p className="text-xs text-muted-foreground">{factor.description}</p>
            </div>
          )
        })}

        <div className="mt-6 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Transparency Note:</strong> These weights are updated based on community feedback and platform
            goals. You can adjust your preferences in settings.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
