/**
 * 编辑器兼容声明。
 *
 * 当前工作区未安装 node_modules 时，保留足够的 Taro/React 类型让页面代码
 * 可以被 TypeScript 语言服务解析。安装项目声明的依赖后，可删除本文件。
 */
declare const process: {
  env: NodeJS.ProcessEnv
}

declare function defineAppConfig(config: Record<string, unknown>): Record<string, unknown>
declare function definePageConfig(config: Record<string, unknown>): Record<string, unknown>

declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elementName: string]: Record<string, unknown>
  }
}

declare module 'react' {
  export type ReactNode = unknown
  export type FC<P = Record<string, never>> = (props: P) => JSX.Element | null
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void
  export function useState<T>(initial: T): [T, (value: T) => void]
  export function useMemo<T>(factory: () => T, deps: unknown[]): T
  const React: {
    createElement: unknown
  }
  export default React
}

declare module 'react/jsx-runtime' {
  export const jsx: unknown
  export const jsxs: unknown
  export const Fragment: unknown
}

declare module '@tarojs/components' {
  type Component = (props: Record<string, unknown>) => JSX.Element | null
  export const View: Component
  export const Text: Component
  export const ScrollView: Component
  export const Image: Component
  export const Input: Component
  export const Textarea: Component
}

declare module '@tarojs/taro' {
  interface NavigateOptions {
    url: string
  }

  interface ToastOptions {
    title: string
    icon?: 'success' | 'none'
  }

  interface CloudApi {
    init(options: { env: string; traceUser?: boolean }): void
  }

  const Taro: {
    cloud: CloudApi
    navigateTo(options: NavigateOptions): void
    navigateBack(): void
    redirectTo(options: NavigateOptions): void
    switchTab(options: NavigateOptions): void
    showToast(options: ToastOptions): void
  }

  export function useDidShow(callback: () => void): void
  export function useDidHide(callback: () => void): void
  export default Taro
}

declare module 'zustand' {
  type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void
  type GetState<T> = () => T
  export function create<T>(initializer: (set: SetState<T>, get: GetState<T>) => T): () => T
}
