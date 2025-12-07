import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getAuth } from '@clerk/nextjs/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiError {
  error: string
  message: string
  details?: Array<{ field: string; message: string; type: string }>
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Add auth token if available (for client-side)
        if (typeof window !== 'undefined') {
          // Clerk handles auth via cookies, but we can add custom headers here if needed
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const apiError = error.response.data
          console.error('API Error:', apiError)
          
          // Handle specific error cases
          if (error.response.status === 401) {
            // Handle unauthorized
            if (typeof window !== 'undefined') {
              window.location.href = '/sign-in'
            }
          } else if (error.response.status === 429) {
            // Rate limit error - provide helpful message
            const detail = apiError?.details || apiError?.message || 'Rate limit exceeded'
            const message = detail.includes('wait') 
              ? detail 
              : `${detail}. Please wait a moment and try again, or add more API keys.`
            return Promise.reject({
              ...apiError,
              message,
              detail: message,
            })
          }
          
          return Promise.reject(apiError || error)
        }
        
        if (error.request) {
          console.error('Network Error:', error.request)
          return Promise.reject({
            error: 'network_error',
            message: 'Network error. Please check your connection.',
          })
        }
        
        return Promise.reject({
          error: 'unknown_error',
          message: 'An unexpected error occurred',
        })
      }
    )
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()

// API endpoints
export const api = {
  simulations: {
    start: (data: {
      scenario: string
      name?: string
      description?: string
      config?: {
        max_turns?: number
        agents?: string[]
        temperature?: number
        enable_memory?: boolean
        enable_analytics?: boolean
      }
      initial_context?: Record<string, any>
    }) => apiClient.post('/simulate/start', data),

    next: (data: {
      session_id: string
      user_input?: string
      focus_agents?: string[]
      context_override?: Record<string, any>
    }) => apiClient.post('/simulate/next', data),

    whatIf: (data: {
      session_id: string
      base_turn?: number
      name?: string
      description?: string
      modifications: Array<{
        type: string
        target: string
        change: Record<string, any>
        description?: string
      }>
      num_turns_to_simulate?: number
    }) => apiClient.post('/simulate/what-if', data),

    getState: (sessionId: string) => apiClient.get(`/simulate/${sessionId}`),

    pause: (sessionId: string) => apiClient.post(`/simulate/${sessionId}/pause`),

    resume: (sessionId: string) => apiClient.post(`/simulate/${sessionId}/resume`),

    delete: (sessionId: string) => apiClient.delete(`/simulate/${sessionId}`),
  },

  agents: {
    list: (activeOnly: boolean = true) => 
      apiClient.get(`/agents/list?active_only=${activeOnly}`),

    get: (role: string) => apiClient.get(`/agents/${role}`),
  },

  memory: {
    get: (sessionId: string, agentRole?: string) => {
      const params = agentRole ? `?agent_role=${agentRole}` : ''
      return apiClient.get(`/memory/${sessionId}${params}`)
    },

    clear: (sessionId: string) => apiClient.delete(`/memory/${sessionId}`),
  },
}

