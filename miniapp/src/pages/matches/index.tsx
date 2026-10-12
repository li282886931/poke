import React, { useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BottomNav } from '@/components/BottomNav'
import { masterMatches, residentListings } from '@/data/mock-data'
import { useSession } from '@/store/session'
import styles from './index.module.scss'

const Matches: React.FC = () => {
  const { role, setRole } = useSession()
  const [filter, setFilter] = useState('全部')
  const items = useMemo(() => role === 'master' ? masterMatches : residentListings, [role])
  const filters = role === 'master' ? ['全部', '优先窗口', '可解锁'] : ['进行中', '审核中', '已关闭']

  return <View className={styles.page}>
    <View className={styles.top}><Text className={styles.title}>匹配</Text><Text className={styles.roleSwitch} onClick={() => setRole(role === 'master' ? 'resident' : 'master')}>切换为{role === 'master' ? '居民' : '师傅'}</Text></View>
    <Text className={styles.subtitle}>{role === 'master' ? '只展示符合你服务范围的需求' : '每个资源均为脱敏信息，请谨慎核验'}</Text>
    <View className={styles.guard}><Text className={styles.guardTitle}>供需双池</Text><Text className={styles.guardCopy}>需求池与供给池双向互推；匹配前先校验资源可用状态、证照有效期与排期重叠，低密度品类自动转预约排队。</Text></View>
    <View className={styles.filterRow}>{filters.map(value => <Text className={filter === value ? styles.filterActive : styles.filter} onClick={() => setFilter(value)} key={value}>{value}</Text>)}</View>
    {items.map(item => (
      <View className={styles.card} key={item.id} onClick={() => Taro.navigateTo({ url: role === 'master' ? '/pages/match-detail/index' : '/pages/publish-detail/index' })}>
        <View className={styles.cardTop}><Text className={styles.category}>{item.category}</Text><Text className={styles.status}>{role === 'master' && 'status' in item && item.status === 'priority' ? item.priorityText : '匹配中'}</Text></View>
        <Text className={styles.cardTitle}>{item.title}</Text>
        <Text className={styles.meta}>{item.district} · {item.distance} · {item.time}</Text>
        <Text className={styles.availability}>资源可用状态：可服务 · 证照有效 · 排期匹配</Text>
        {'reason' in item && <View className={styles.reasons}>{item.reason.map(reason => <Text className={styles.reason} key={reason}>{reason}</Text>)}</View>}
        <View className={styles.cardFoot}><Text>{'publishTime' in item ? item.publishTime : item.createdAt}</Text><Text className={styles.link}>{role === 'master' ? '查看并解锁' : '查看响应'} ›</Text></View>
      </View>
    ))}
    <BottomNav active="matches" />
  </View>
}
export default Matches
