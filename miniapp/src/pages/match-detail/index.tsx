import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import { masterMatches } from '@/data/mock-data'
import { canUnlockMatch } from '@/domain/rules'
import { useSession } from '@/store/session'
import styles from './index.module.scss'

const MatchDetail: React.FC = () => {
  const { role } = useSession()
  const match = masterMatches[0]
  const permission = canUnlockMatch({ matchStatus: match.status, priorityOwnerId: match.priorityOwnerId, currentUserId: role === 'master' ? 'master-01' : 'resident-01', listingStatus: 'matching' })
  return <BusinessPage title={match.title} eyebrow="需求匹配 · 脱敏信息" status="优先窗口" actionLabel={permission.allowed ? `确认解锁 · ${match.creditCost} 额度` : permission.reason} onAction={() => permission.allowed && Taro.navigateTo({ url: '/pages/unlock/index' })}>
    <View className={styles.window}><Text className={styles.windowTitle}>{match.priorityText}</Text><Text className={styles.windowCopy}>优先窗口由服务端状态控制，结束后会自动进入普通池。</Text></View>
    <Text className={styles.label}>匹配说明</Text><View className={styles.reasons}>{match.reason.map(value => <Text key={value}>✓ {value}</Text>)}</View>
    <Text className={styles.label}>需求摘要</Text><View className={styles.summary}><Text>服务区域</Text><Text>{match.district} · {match.distance}</Text><Text>可服务时间</Text><Text>{match.time}</Text><Text>联系方式</Text><Text>解锁后受控显示</Text></View>
  </BusinessPage>
}
export default MatchDetail
