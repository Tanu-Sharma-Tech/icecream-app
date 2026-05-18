import axios from 'axios'

const BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://sweet-movement-api.onrender.com/api'

const axiosInstance = axios.create({
  baseURL:         BASE_URL,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        )
        const newToken = res.data.accessToken
        localStorage.setItem('accessToken', newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(original)
      } catch {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance