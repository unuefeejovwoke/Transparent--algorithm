export interface AlgorithmConfig {
  weights: {
    recency: number
    engagement: number
    affinity: number
    trending: number
  }
  contentModeration: {
    autoModeration: boolean
    flaggedKeywords: string[]
    maxPostLength: number
    requireApproval: boolean
  }
  userSettings: {
    maxPostsPerHour: number
    allowAnonymous: boolean
    verificationRequired: boolean
  }
  transparency: {
    showAlgorithmScores: boolean
    allowUserCustomization: boolean
    showExplanations: boolean
  }
}

const defaultConfig: AlgorithmConfig = {
  weights: {
    recency: 35,
    engagement: 30,
    affinity: 20,
    trending: 15,
  },
  contentModeration: {
    autoModeration: true,
    flaggedKeywords: ["spam", "hate", "abuse"],
    maxPostLength: 500,
    requireApproval: false,
  },
  userSettings: {
    maxPostsPerHour: 10,
    allowAnonymous: false,
    verificationRequired: false,
  },
  transparency: {
    showAlgorithmScores: true,
    allowUserCustomization: true,
    showExplanations: true,
  },
}

export const adminConfigStorage = {
  getConfig: (): AlgorithmConfig => {
    if (typeof window === "undefined") return defaultConfig
    const config = localStorage.getItem("admin_algorithm_config")
    return config ? { ...defaultConfig, ...JSON.parse(config) } : defaultConfig
  },

  saveConfig: (config: AlgorithmConfig): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("admin_algorithm_config", JSON.stringify(config))
  },

  updateWeights: (weights: Partial<AlgorithmConfig["weights"]>): void => {
    const config = adminConfigStorage.getConfig()
    config.weights = { ...config.weights, ...weights }
    adminConfigStorage.saveConfig(config)
  },

  getAnalytics: () => {
    if (typeof window === "undefined") return null

    const users = JSON.parse(localStorage.getItem("social_users") || "[]")
    const posts = JSON.parse(localStorage.getItem("social_posts") || "[]")

    const totalUsers = users.length
    const totalPosts = posts.length
    const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.likes?.length || 0), 0)
    const totalComments = posts.reduce((sum: number, post: any) => sum + (post.comments?.length || 0), 0)

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentPosts = posts.filter((post: any) => new Date(post.timestamp) > last24Hours)
    const recentUsers = users.filter((user: any) => new Date(user.createdAt) > last24Hours)

    return {
      totalUsers,
      totalPosts,
      totalLikes,
      totalComments,
      recentPosts: recentPosts.length,
      recentUsers: recentUsers.length,
      avgEngagement: totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : "0",
    }
  },
}
