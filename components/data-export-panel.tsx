"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { dataExportService } from "@/lib/data-export"
import { Download, FileText, Database, BarChart3, Shield } from "lucide-react"

export function DataExportPanel() {
  const { user } = useAuth()
  const [isExporting, setIsExporting] = useState(false)

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Sign in to export your data</p>
        </CardContent>
      </Card>
    )
  }

  const handleUserDataExport = async (format: "json" | "csv") => {
    setIsExporting(true)
    try {
      const userData = dataExportService.exportUserData(user.id)
      if (!userData) {
        alert("Failed to export user data")
        return
      }

      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `user-data-${user.name.replace(/\s+/g, "-").toLowerCase()}-${timestamp}`

      if (format === "json") {
        dataExportService.downloadJSON(userData, `${filename}.json`)
      } else {
        // For CSV, export posts data
        dataExportService.downloadCSV(userData.posts, `${filename}-posts.csv`)
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleAdminDataExport = async (format: "json" | "csv") => {
    if (user.role !== "admin") return

    setIsExporting(true)
    try {
      const adminData = dataExportService.exportAdminData()
      if (!adminData) {
        alert("Failed to export admin data")
        return
      }

      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `platform-data-${timestamp}`

      if (format === "json") {
        dataExportService.downloadJSON(adminData, `${filename}.json`)
      } else {
        // Export multiple CSV files
        dataExportService.downloadCSV(adminData.users, `${filename}-users.csv`)
        dataExportService.downloadCSV(adminData.posts, `${filename}-posts.csv`)
        dataExportService.downloadCSV(adminData.analytics.engagementTrends, `${filename}-engagement.csv`)
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export
        </CardTitle>
        <CardDescription>Download your data and algorithm insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Data Export */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <h4 className="font-medium">Personal Data</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Export your posts, interactions, and personalized algorithm data
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleUserDataExport("json")} disabled={isExporting}>
              <Database className="h-4 w-4 mr-2" />
              JSON Format
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleUserDataExport("csv")} disabled={isExporting}>
              <BarChart3 className="h-4 w-4 mr-2" />
              CSV Format
            </Button>
          </div>
        </div>

        {/* Admin Data Export */}
        {user.role === "admin" && (
          <>
            <div className="border-t pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <h4 className="font-medium">Platform Analytics</h4>
                  <Badge variant="secondary">Admin Only</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Export platform-wide analytics, user data, and engagement metrics
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdminDataExport("json")}
                    disabled={isExporting}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Full JSON Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdminDataExport("csv")}
                    disabled={isExporting}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    CSV Reports
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Export Information */}
        <div className="p-3 bg-muted rounded-lg">
          <h5 className="text-sm font-medium mb-2">What's included in your export:</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Your posts and engagement metrics</li>
            <li>• Algorithm scores and ranking factors</li>
            <li>• Your interaction history (likes, comments)</li>
            <li>• Account preferences and settings</li>
            {user.role === "admin" && (
              <>
                <li>• Platform-wide user analytics</li>
                <li>• Content engagement trends</li>
                <li>• Algorithm performance metrics</li>
              </>
            )}
          </ul>
        </div>

        {isExporting && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Preparing your data export...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
