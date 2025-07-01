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

      // Store username for later use
      userStorage.setUsername(username)

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

  async register(username: string, password: string, email: string, firstName: string, lastName: string) {
    try {
      console.log("Attempting registration with:", { username, email, firstName, lastName })

      const response = await fetch("https://cowek1275.pythonanywhere.com/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName,
        }),
      })

      console.log("Register response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Register error:", errorData)
        throw new Error(errorData.message || errorData.error || `Registration failed (${response.status})`)
      }

      const data = await response.json()
      console.log("Register success:", data)

      // Store username for later use
      userStorage.setUsername(username)

      return {
        token: data.token || data.access_token || data.jwt || "default-token",
        user: data.user || {
          id: data.id || Date.now(),
          email: data.email || email,
          name: data.name || data.username || `${firstName} ${lastName}` || username,
        },
      }
    } catch (error) {
      console.error("Register API error:", error)
      throw error
    }
  },

  async verifyToken(token: string) {
    // Since there's no verify endpoint, we'll decode the token client-side
    // and use stored username for consistency
    try {
      const storedUsername = userStorage.getUsername()

      if (token.includes(".")) {
        // JWT token
        const payload = JSON.parse(atob(token.split(".")[1]))
        return {
          id: payload.user_id || payload.id || Date.now(),
          email: payload.email || `${storedUsername || "user"}@example.com`,
          name: payload.name || payload.username || storedUsername || "User",
        }
      } else {
        // Simple token - create basic user data with stored username
        return {
          id: Date.now(),
          email: `${storedUsername || "user"}@example.com`,
          name: storedUsername || "User",
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

export const userStorage = {
  getUsername(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth-username")
  },

  setUsername(username: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("auth-username", username)
  },

  removeUsername(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("auth-username")
  },
}
