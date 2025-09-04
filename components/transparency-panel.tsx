"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { DataExportPanel } from "@/components/data-export-panel"
import { Info, Settings, Eye, Shield } from "lucide-react"
import { useState } from "react"

export function TransparencyPanel() {
  const [showScores, setShowScores] = useState(true)
  const [diversityWeight, setDiversityWeight] = useState([25])
  const [recencyWeight, setRecencyWeight] = useState([35])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Transparency Controls
          </CardTitle>
          <CardDescription>Customize how much you see behind the algorithm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visibility Controls */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Visibility Settings
            </h4>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium text-sm">Show Algorithm Scores</div>
                <div className="text-xs text-muted-foreground">Display ranking scores on each post</div>
              </div>
              <Switch checked={showScores} onCheckedChange={setShowScores} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium text-sm">Explain Recommendations</div>
                <div className="text-xs text-muted-foreground">Show why content was recommended</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Algorithm Tuning */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Algorithm Preferences
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Content Diversity</span>
                  <Badge variant="outline">{diversityWeight[0]}%</Badge>
                </div>
                <Slider
                  value={diversityWeight}
                  onValueChange={setDiversityWeight}
                  max={50}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher values show more varied content outside your usual interests
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Recency Priority</span>
                  <Badge variant="outline">{recencyWeight[0]}%</Badge>
                </div>
                <Slider
                  value={recencyWeight}
                  onValueChange={setRecencyWeight}
                  max={50}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How much to prioritize newer content over popular content
                </p>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Your Data Usage
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posts analyzed today:</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interactions tracked:</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profile updates:</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>

          {/* Algorithm Audit */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 text-green-600" />
              <div className="space-y-1">
                <div className="text-sm font-medium">Algorithm Audit: Passed</div>
                <div className="text-xs text-muted-foreground">
                  Last reviewed by independent auditors on Dec 15, 2024. No bias or manipulation detected.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataExportPanel />
    </div>
  )
}
