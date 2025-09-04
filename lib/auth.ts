export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  createdAt: string
  preferences: {
    algorithmTransparency: boolean
    dataExport: boolean
    notifications: boolean
  }
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Simple user storage using localStorage
export const authStorage = {
  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem("social_users")
    return users ? JSON.parse(users) : []
  },

  saveUser: (user: User): void => {
    if (typeof window === "undefined") return
    const users = authStorage.getUsers()
    const existingIndex = users.findIndex((u) => u.id === user.id)

    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }

    localStorage.setItem("social_users", JSON.stringify(users))
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const currentUserId = localStorage.getItem("current_user_id")
    if (!currentUserId) return null

    const users = authStorage.getUsers()
    return users.find((u) => u.id === currentUserId) || null
  },

  setCurrentUser: (userId: string | null): void => {
    if (typeof window === "undefined") return
    if (userId) {
      localStorage.setItem("current_user_id", userId)
    } else {
      localStorage.removeItem("current_user_id")
    }
  },

  createUser: (email: string, password: string, name: string): User => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: email === "admin@example.com" ? "admin" : "user",
      createdAt: new Date().toISOString(),
      preferences: {
        algorithmTransparency: true,
        dataExport: true,
        notifications: true,
      },
    }

    authStorage.saveUser(user)
    // Store password separately (in real app, this would be hashed)
    localStorage.setItem(`password_${user.id}`, password)

    return user
  },

  validateLogin: (email: string, password: string): User | null => {
    const users = authStorage.getUsers()
    console.log(
      "[v0] Available users:",
      users.map((u) => u.email),
    )

    const user = users.find((u) => u.email === email)
    console.log("[v0] Found user:", user?.email)

    if (!user) return null

    const storedPassword = localStorage.getItem(`password_${user.id}`)
    console.log("[v0] Password check:", storedPassword === password)

    return storedPassword === password ? user : null
  },
}

export const initializeDefaultUsers = (): void => {
  if (typeof window === "undefined") return

  const existingUsers = authStorage.getUsers()
  console.log("[v0] Existing users count:", existingUsers.length)

  const hasTestUser = existingUsers.some((u) => u.email === "user@test.com")
  const hasTestAdmin = existingUsers.some((u) => u.email === "admin@test.com")

  if (hasTestUser && hasTestAdmin) {
    console.log("[v0] Test users already exist")
    return
  }

  console.log("[v0] Creating missing test users...")

  // Create default test users if they don't exist
  const defaultUsers = [
    {
      email: "user@test.com",
      password: "password123",
      name: "Test User",
      role: "user" as const,
    },
    {
      email: "admin@test.com",
      password: "admin123",
      name: "Admin User",
      role: "admin" as const,
    },
  ]

  defaultUsers.forEach(({ email, password, name, role }) => {
    const userExists = existingUsers.some((u) => u.email === email)
    if (userExists) {
      console.log(`[v0] User ${email} already exists, skipping`)
      return
    }

    console.log(`[v0] Creating user: ${email}`)
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      preferences: {
        algorithmTransparency: true,
        dataExport: true,
        notifications: true,
      },
    }

    authStorage.saveUser(user)
    localStorage.setItem(`password_${user.id}`, password)
  })
}
