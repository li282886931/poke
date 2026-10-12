import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import { actionIcons } from '@/data/icon-assets'
import styles from './index.module.scss'

const Onboarding: React.FC = () => {
  const [enabled, setEnabled] = useState(true)
  return <BusinessPage title="认证与服务范围" eyebrow="师傅入驻" status="认证已通过" actionLabel="保存服务范围" onAction={() => Taro.showToast({ title: '服务范围已保存', icon: 'success' })}>
    <View className={styles.notice}><Image className={styles.noticeIcon} src={actionIcons.success} /><Text>家电维修资质有效至 2027 年 6 月</Text></View>
    <View className={styles.form}><Text className={styles.label}>服务区域</Text><Text className={styles.value}>成都 · 高新区、武侯区</Text><Text className={styles.label}>服务品类</Text><Text className={styles.value}>空调、洗衣机、冰箱检修</Text><Text className={styles.label}>服务半径</Text><Text className={styles.value}>8 km</Text></View>
    <View className={styles.statusRow}><View><Text className={styles.label}>接收新匹配</Text><Text className={styles.hint}>暂停不会影响已解锁记录</Text></View><Text className={enabled ? styles.toggleOn : styles.toggleOff} onClick={() => setEnabled(!enabled)}>{enabled ? '开启' : '暂停'}</Text></View>
  </BusinessPage>
}
export default Onboarding
