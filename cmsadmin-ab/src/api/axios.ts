import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Attach token ke setiap request
api.interceptors.request.use((config) => {
  const session = localStorage.getItem("session")
  if (session) {
    try {
      const { token } = JSON.parse(session)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.error("Invalid session format:", e)
    }
  }
  return config
})

// Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("session")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
