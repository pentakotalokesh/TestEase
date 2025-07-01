"use client"

export const authAPI = {
  async login(username: string, password: string) {
    try {
      console.log("Attempting login with:", { username })

      const response = await fetch("https://cowek1275.pythonanywhere.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("Login response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Login error:", errorData)
        throw new Error(errorData.message || errorData.error || `Login failed (${response.status})`)
      }

      const data = await response.json()
      console.log("Login success:", data)

      return {
        token: data.token || data.access_token || data.jwt || "default-token",
        user: data.user || {
          id: data.id || Date.now(),
          email: data.email || `${username}@example.com`,
          name: data.name || data.username || username,
        },
      }
    } catch (error) {
      console.error("Login API error:", error)
      throw error
    }
  },

  async register(username: string, password: string) {
    try {
      console.log("Attempting registration with:", { username })

      const response = await fetch("https://cowek1275.pythonanywhere.com/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("Register response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Register error:", errorData)
        throw new Error(errorData.message || errorData.error || `Registration failed (${response.status})`)
      }

      const data = await response.json()
      console.log("Register success:", data)

      return {
        token: data.token || data.access_token || data.jwt || "default-token",
        user: data.user || {
          id: data.id || Date.now(),
          email: data.email || `${username}@example.com`,
          name: data.name || data.username || username,
        },
      }
    } catch (error) {
      console.error("Register API error:", error)
      throw error
    }
  },

  async verifyToken(token: string) {
    // Since there's no verify endpoint, we'll decode the token client-side
    try {
      if (token.includes(".")) {
        // JWT token
        const payload = JSON.parse(atob(token.split(".")[1]))
        return {
          id: payload.user_id || payload.id || Date.now(),
          email: payload.email || "user@example.com",
          name: payload.name || payload.username || "User",
        }
      } else {
        // Simple token - create basic user data
        return {
          id: Date.now(),
          email: "user@example.com",
          name: "User",
        }
      }
    } catch (error) {
      console.error("Token verification error:", error)
      throw new Error("Invalid token")
    }
  },
}

export const tokenStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth-token")
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("auth-token", token)
  },

  removeToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("auth-token")
  },
}
