"use client"

// Mock API functions - replace with your actual API endpoints
export const authAPI = {
  async login(email: string, password: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (email === "user@example.com" && password === "password") {
      const token = "mock-jwt-token-" + Date.now()
      const user = { id: 1, email, name: "John Doe" }
      return { token, user }
    }
    throw new Error("Invalid credentials")
  },

  async register(email: string, password: string, name: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration
    const token = "mock-jwt-token-" + Date.now()
    const user = { id: Date.now(), email, name }
    return { token, user }
  },

  async verifyToken(token: string) {
    // Simulate token verification
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (token.startsWith("mock-jwt-token-")) {
      return { id: 1, email: "user@example.com", name: "John Doe" }
    }
    throw new Error("Invalid token")
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
