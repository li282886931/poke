import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import styles from './index.module.scss'

function param(name: string, fallback: string) {
  // Taro.getCurrentInstance exists at miniapp runtime; local editor compat types are intentionally minimal.
  const runtime = Taro as typeof Taro & {
    getCurrentInstance: () => { router?: { params?: Record<string, string> } }
  }
  const value = runtime.getCurrentInstance().router?.params?.[name]
  return value ? decodeURIComponent(String(value)) : fallback
}

const PublishDetail = () => {
  const title = param('title', '空调不制冷，需要上门检修')
  const category = param('category', '家电维修')
  const district = param('district', '高新区')
  const time = param('time', '今天 18:00 后')
  const status = param('status', 'matching')
  const readableStatus = status === 'pending_review' ? '待核验' : status === 'pending_confirmation' ? '待确认' : '匹配中'

  return <BusinessPage title={title} eyebrow="我的发布 · 已提交" status={readableStatus} actionLabel="查看资源响应" onAction={() => Taro.redirectTo({ url: '/pages/matches/index' })}>
    <View className={styles.timeline}><Text className={styles.done}>已提交</Text><Text className={styles.line} /><Text className={styles.current}>{readableStatus}</Text><Text className={styles.line} /><Text className={styles.pending}>资源联系</Text></View>
    <View className={styles.summary}><Text className={styles.category}>{category}</Text><Text className={styles.copy}>系统会去资源池匹配，有合适的资源方会联系你；暂时没有就继续等待匹配。</Text></View>
    <View className={styles.detail}><Text>服务区域</Text><Text>成都 · {district}</Text><Text>可服务时间</Text><Text>{time}</Text><Text>联系方式</Text><Text>只用于匹配与资源方联系</Text></View>
  </BusinessPage>
}

export default PublishDetail
