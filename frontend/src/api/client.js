import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('taskflow-access-token')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('taskflow-refresh-token')

      if (!refreshToken) {
        localStorage.removeItem('taskflow-access-token')
        localStorage.removeItem('taskflow-refresh-token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        originalRequest._retry = true
        const { data } = await axios.post('http://localhost:8000/api/auth/refresh/', {
          refresh: refreshToken,
        })

        localStorage.setItem('taskflow-access-token', data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('taskflow-access-token')
        localStorage.removeItem('taskflow-refresh-token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
