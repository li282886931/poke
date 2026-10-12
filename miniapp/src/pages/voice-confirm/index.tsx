import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import styles from './index.module.scss'

const VoiceConfirm: React.FC = () => <BusinessPage title="确认识别结果" eyebrow="识别建议不会在确认前参与匹配" actionLabel="确认并继续" onAction={() => Taro.navigateTo({ url: '/pages/publish/index' })}>
  <View className={styles.transcript}><Text className={styles.copy}>“我家挂机空调不制冷，想今天晚上六点以后在高新区找师傅上门看一下。”</Text><Text className={styles.edit}>编辑原文</Text></View>
  <Text className={styles.label}>已识别字段</Text>
  <View className={styles.tags}><Text>家电维修</Text><Text>空调检修</Text><Text>高新区</Text><Text>今天 18:00 后</Text></View>
  <View className={styles.secondary} onClick={() => Taro.navigateBack()}>重新说一次</View>
</BusinessPage>
export default VoiceConfirm
