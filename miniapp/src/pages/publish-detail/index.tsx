import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import styles from './index.module.scss'

const PublishDetail: React.FC = () => <BusinessPage title="空调不制冷，需要上门检修" eyebrow="我的发布 · 今天 10:24" status="匹配中" actionLabel="查看资源响应" onAction={() => Taro.redirectTo({ url: '/pages/matches/index' })}>
  <View className={styles.timeline}><Text className={styles.done}>已提交</Text><Text className={styles.line} /><Text className={styles.done}>已核验</Text><Text className={styles.line} /><Text className={styles.current}>匹配中</Text></View>
  <View className={styles.summary}><Text className={styles.category}>家电维修</Text><Text className={styles.copy}>已按脱敏规则展示给符合服务范围的资源方，精确地址与联系方式不会公开。</Text></View>
  <View className={styles.detail}><Text>服务区域</Text><Text>成都 · 高新区</Text><Text>可服务时间</Text><Text>今天 18:00 后</Text><Text>规格</Text><Text>挂机空调 · 1 台</Text></View>
</BusinessPage>
export default PublishDetail
