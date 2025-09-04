export interface UserDataExport {
  user: {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    preferences: any
  }
  posts: Array<{
    id: string
    content: string
    timestamp: string
    likes: number
    comments: number
  }>
  interactions: {
    totalLikes: number
    totalComments: number
    likedPosts: string[]
    commentedPosts: string[]
  }
  algorithmData: {
    personalizedScores: any[]
    engagementPatterns: any
  }
}

export interface AdminDataExport {
  platform: {
    totalUsers: number
    totalPosts: number
    totalEngagement: number
    exportDate: string
  }
  users: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    postCount: number
    engagementScore: number
  }>
  posts: Array<{
    id: string
    authorName: string
    content: string
    timestamp: string
    likes: number
    comments: number
    algorithmScore?: number
  }>
  analytics: {
    engagementTrends: any[]
    userGrowth: any[]
    contentMetrics: any
  }
}

export const dataExportService = {
  exportUserData: (userId: string): UserDataExport | null => {
    if (typeof window === "undefined") return null

    // Get user data
    const users = JSON.parse(localStorage.getItem("social_users") || "[]")
    const user = users.find((u: any) => u.id === userId)
    if (!user) return null

    // Get user posts
    const allPosts = JSON.parse(localStorage.getItem("social_posts") || "[]")
    const userPosts = allPosts.filter((post: any) => post.authorId === userId)

    // Calculate interactions
    const likedPosts = allPosts.filter((post: any) => post.likes?.includes(userId)).map((post: any) => post.id)
    const commentedPosts = allPosts
      .filter((post: any) => post.comments?.some((comment: any) => comment.authorId === userId))
      .map((post: any) => post.id)

    const totalLikes = userPosts.reduce((sum: number, post: any) => sum + (post.likes?.length || 0), 0)
    const totalComments = userPosts.reduce((sum: number, post: any) => sum + (post.comments?.length || 0), 0)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        preferences: user.preferences,
      },
      posts: userPosts.map((post: any) => ({
        id: post.id,
        content: post.content,
        timestamp: post.timestamp,
        likes: post.likes?.length || 0,
        comments: post.comments?.length || 0,
      })),
      interactions: {
        totalLikes,
        totalComments,
        likedPosts,
        commentedPosts,
      },
      algorithmData: {
        personalizedScores: userPosts.map((post: any) => ({
          postId: post.id,
          algorithmScore: post.algorithmScore,
          factors: post.factors,
        })),
        engagementPatterns: {
          avgLikesPerPost: userPosts.length > 0 ? totalLikes / userPosts.length : 0,
          avgCommentsPerPost: userPosts.length > 0 ? totalComments / userPosts.length : 0,
          mostActiveHour: this.calculateMostActiveHour(userPosts),
        },
      },
    }
  },

  exportAdminData: (): AdminDataExport | null => {
    if (typeof window === "undefined") return null

    const users = JSON.parse(localStorage.getItem("social_users") || "[]")
    const posts = JSON.parse(localStorage.getItem("social_posts") || "[]")

    const totalUsers = users.length
    const totalPosts = posts.length
    const totalEngagement = posts.reduce(
      (sum: number, post: any) => sum + (post.likes?.length || 0) + (post.comments?.length || 0),
      0,
    )

    return {
      platform: {
        totalUsers,
        totalPosts,
        totalEngagement,
        exportDate: new Date().toISOString(),
      },
      users: users.map((user: any) => {
        const userPosts = posts.filter((post: any) => post.authorId === user.id)
        const userEngagement = userPosts.reduce(
          (sum: number, post: any) => sum + (post.likes?.length || 0) + (post.comments?.length || 0),
          0,
        )

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          postCount: userPosts.length,
          engagementScore: userEngagement,
        }
      }),
      posts: posts.map((post: any) => ({
        id: post.id,
        authorName: post.authorName,
        content: post.content,
        timestamp: post.timestamp,
        likes: post.likes?.length || 0,
        comments: post.comments?.length || 0,
        algorithmScore: post.algorithmScore,
      })),
      analytics: {
        engagementTrends: this.calculateEngagementTrends(posts),
        userGrowth: this.calculateUserGrowth(users),
        contentMetrics: this.calculateContentMetrics(posts),
      },
    }
  },

  calculateMostActiveHour: (posts: any[]): number => {
    const hourCounts = new Array(24).fill(0)
    posts.forEach((post) => {
      const hour = new Date(post.timestamp).getHours()
      hourCounts[hour]++
    })
    return hourCounts.indexOf(Math.max(...hourCounts))
  },

  calculateEngagementTrends: (posts: any[]): any[] => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayPosts = posts.filter((post) => {
        const postDate = new Date(post.timestamp)
        return postDate.toDateString() === date.toDateString()
      })

      const engagement = dayPosts.reduce(
        (sum, post) => sum + (post.likes?.length || 0) + (post.comments?.length || 0),
        0,
      )

      last7Days.push({
        date: date.toISOString().split("T")[0],
        posts: dayPosts.length,
        engagement,
      })
    }
    return last7Days
  },

  calculateUserGrowth: (users: any[]): any[] => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayUsers = users.filter((user) => {
        const userDate = new Date(user.createdAt)
        return userDate.toDateString() === date.toDateString()
      })

      last7Days.push({
        date: date.toISOString().split("T")[0],
        newUsers: dayUsers.length,
      })
    }
    return last7Days
  },

  calculateContentMetrics: (posts: any[]): any => {
    const avgLength = posts.reduce((sum, post) => sum + post.content.length, 0) / posts.length || 0
    const avgLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0) / posts.length || 0
    const avgComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0) / posts.length || 0

    return {
      averagePostLength: Math.round(avgLength),
      averageLikesPerPost: Math.round(avgLikes * 10) / 10,
      averageCommentsPerPost: Math.round(avgComments * 10) / 10,
      totalPosts: posts.length,
    }
  },

  downloadJSON: (data: any, filename: string): void => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  downloadCSV: (data: any[], filename: string): void => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
}
