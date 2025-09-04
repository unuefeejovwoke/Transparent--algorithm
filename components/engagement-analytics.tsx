"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const engagementData = [
  { time: "00:00", likes: 45, comments: 12, shares: 8 },
  { time: "04:00", likes: 23, comments: 6, shares: 3 },
  { time: "08:00", likes: 89, comments: 34, shares: 21 },
  { time: "12:00", likes: 156, comments: 67, shares: 43 },
  { time: "16:00", likes: 134, comments: 45, shares: 32 },
  { time: "20:00", likes: 198, comments: 89, shares: 56 },
]

const contentTypeData = [
  { name: "Images", value: 45, color: "#8884d8" },
  { name: "Videos", value: 35, color: "#82ca9d" },
  { name: "Text Posts", value: 15, color: "#ffc658" },
  { name: "Links", value: 5, color: "#ff7c7c" },
]

const algorithmPerformance = [
  { metric: "Click-through Rate", current: 12.5, previous: 10.2 },
  { metric: "Time Spent", current: 8.3, previous: 7.1 },
  { metric: "User Satisfaction", current: 4.2, previous: 3.8 },
  { metric: "Content Diversity", current: 0.85, previous: 0.72 },
]

export function EngagementAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Analytics & Algorithm Performance</CardTitle>
        <CardDescription>Real-time insights into how the algorithm affects user engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="engagement" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="engagement">Engagement Patterns</TabsTrigger>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
            <TabsTrigger value="performance">Algorithm Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="likes" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="comments" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="shares" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">1,245</div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">453</div>
                <div className="text-sm text-muted-foreground">Total Comments</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">267</div>
                <div className="text-sm text-muted-foreground">Total Shares</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <h3 className="text-lg font-semibold mb-4">Content Type Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contentTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content Performance Insights</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Videos perform 2.3x better</div>
                    <div className="text-sm text-muted-foreground">Higher engagement rates during evening hours</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Images peak at lunch time</div>
                    <div className="text-sm text-muted-foreground">12-2 PM shows highest interaction rates</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">Text posts drive discussions</div>
                    <div className="text-sm text-muted-foreground">Generate 40% more comments per view</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Algorithm Performance Metrics</h3>
                {algorithmPerformance.map((metric) => (
                  <div key={metric.metric} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{metric.metric}</span>
                      <span
                        className={`text-sm ${metric.current > metric.previous ? "text-green-600" : "text-red-600"}`}
                      >
                        {metric.current > metric.previous ? "↗" : "↘"}
                        {(((metric.current - metric.previous) / metric.previous) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{metric.current}</div>
                    <div className="text-sm text-muted-foreground">Previous: {metric.previous}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Algorithm Transparency Report</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="font-medium text-green-800 dark:text-green-200">Bias Detection: Clear</div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      No demographic bias detected in content distribution
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="font-medium text-blue-800 dark:text-blue-200">Diversity Score: 85%</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Good variety in content sources and topics
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="font-medium text-yellow-800 dark:text-yellow-200">Filter Bubble Risk: Medium</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      Recommending 15% content outside user preferences
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
