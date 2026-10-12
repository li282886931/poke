import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import { useSession } from '@/store/session'
import styles from './index.module.scss'

const Credits: React.FC = () => {
  const { credit } = useSession()
  return <BusinessPage title="额度账户" eyebrow="余额只读，所有变化均保留流水" actionLabel="查看解锁记录" onAction={() => Taro.navigateTo({ url: '/pages/feedback/index' })}>
    <View className={styles.balance}><Text>可用额度</Text><Text className={styles.amount}>{credit}</Text><Text>冻结 8 · 本月消费 14</Text></View>
    <Text className={styles.label}>额度效率</Text>
    <View className={styles.metrics}><View><Text className={styles.metricNum}>12</Text><Text>已解锁数</Text></View><View><Text className={styles.metricNum}>68%</Text><Text>有效率</Text></View><View><Text className={styles.metricNum}>8%</Text><Text>退款率</Text></View><View><Text className={styles.metricNum}>3.1</Text><Text>单条有效线索成本</Text></View></View>
    <Text className={styles.label}>人工充值</Text>
    <View className={styles.manual}><Text>iOS 与线下对公场景统一提交人工充值工单，财务确认后先冻结，双人复核后入账可用。</Text></View>
    <Text className={styles.label}>最近流水</Text>
    <View className={styles.list}><View><Text>解锁：空调检修需求</Text><Text>今天 10:38</Text><Text className={styles.minus}>-8</Text></View><View><Text>额度包到账</Text><Text>10 月 10 日</Text><Text className={styles.plus}>+50</Text></View><View><Text>退款：联系人授权异常</Text><Text>10 月 08 日</Text><Text className={styles.plus}>+6</Text></View></View>
  </BusinessPage>
}
export default Credits
