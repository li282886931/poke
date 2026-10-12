import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import { actionIcons } from '@/data/icon-assets'
import { useSession } from '@/store/session'
import styles from './index.module.scss'

const Unlock: React.FC = () => {
  const [done, setDone] = useState(false)
  const { credit, consumeCredit } = useSession()
  const confirm = () => {
    if (!consumeCredit(8)) return Taro.showToast({ title: '可用额度不足', icon: 'none' })
    setDone(true)
  }
  return <BusinessPage title={done ? '解锁成功' : '确认解锁'} eyebrow={done ? '联系人授权有效期内可查看' : '一次性确认，避免重复扣减'} actionLabel={done ? '进入服务跟进' : '确认消耗 8 额度'} onAction={done ? () => Taro.redirectTo({ url: '/pages/matches/index' }) : confirm}>
    {done ? <View className={styles.success}><Image className={styles.check} src={actionIcons.success} /><Text className={styles.name}>李女士</Text><Text className={styles.phone}>138 **** 2568</Text><Text className={styles.note}>联系方式受控展示，请仅用于本次撮合服务。</Text></View> : <View className={styles.card}><Text className={styles.listing}>空调不制冷，需要上门检修</Text><View className={styles.row}><Text>本次消耗</Text><Text className={styles.strong}>8 额度</Text></View><View className={styles.row}><Text>可用余额</Text><Text>{credit} 额度</Text></View><View className={styles.row}><Text>退款规则</Text><Text>按平台规则核验</Text></View></View>}
  </BusinessPage>
}
export default Unlock
