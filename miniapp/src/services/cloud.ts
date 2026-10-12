import Taro from '@tarojs/taro'

import { API_BASE_URL } from './config'

const apiRoutes: Record<string, { method: 'GET' | 'POST'; path: string }> = {
  getDashboard: { method: 'GET', path: '/api/v1/dashboard' },
  createListing: { method: 'POST', path: '/api/v1/listings' },
  unlockMatch: { method: 'POST', path: '/api/v1/unlocks' },
}

interface APIResponse<T> {
  code: number
  message: string
  data: T
}

export async function callFunction<T = any>(
  name: string,
  data?: Record<string, any>
): Promise<T> {
  const route = apiRoutes[name]
  if (!route) {
    return loadLocalMock<T>(name, data)
  }

  try {
    const response = await Taro.request<APIResponse<T>>({
      url: `${API_BASE_URL}${route.path}`,
      method: route.method,
      data,
      timeout: 5000,
      header: {
        'content-type': 'application/json',
      },
    })

    if (response.statusCode >= 200 && response.statusCode < 300 && response.data?.code === 0) {
      return response.data.data
    }
  } catch (error) {
    // Local mock keeps the miniapp usable while the Go API or MongoDB is offline.
  }

  return loadLocalMock<T>(name, data)
}

async function loadLocalMock<T>(name: string, data?: Record<string, any>): Promise<T> {
  const mockModule = await import(`../data/${name}`)
  return mockModule.default(data) as T
}

export function getDatabase() {
  return null
}
