export async function callFunction<T = any>(
  name: string,
  data?: Record<string, any>
): Promise<T> {
  const mockModule = await import(`../data/${name}`)
  return mockModule.default(data) as T
}

export function getDatabase() {
  return null
}
