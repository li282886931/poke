import React, { useState } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import styles from './index.module.scss'

const Feedback: React.FC = () => {
  const [choice, setChoice] = useState('有效已联系')
  const options = ['有效已联系', '有效暂不需要', '无效打不通或未发布', '无效价格不合适']
  return <BusinessPage title="反馈与申诉" eyebrow="72 小时四选一反馈将用于退款规则核验与后续仲裁" actionLabel="提交反馈" onAction={() => Taro.showToast({ title: '已提交，等待核验', icon: 'success' })}>
    <View className={styles.trace}><Text className={styles.traceTitle}>服务确认单</Text><Text className={styles.traceCopy}>事项、时间、地点和双方约定线上留痕，不填写金额；线下结算争议以确认单、反馈记录、回拨记录和双方陈述为依据。</Text></View>
    <Text className={styles.label}>本次撮合结果</Text><View className={styles.options}>{options.map(value => <Text className={choice === value ? styles.active : styles.option} key={value} onClick={() => setChoice(value)}>{value}</Text>)}</View>
    <Text className={styles.label}>补充说明</Text><Textarea className={styles.textarea} placeholder="请描述可核验的事实，可补充回拨线索或服务确认单信息。" maxlength={300} />
    <View className={styles.notice}><Text>退款提示</Text><Text>仅“无效打不通或未发布”进入退款核验；“无效价格不合适”不退款，不扣发布者分。</Text></View>
    <Text className={styles.label}>联系客服</Text>
    <View className={styles.service}><Text className={styles.traceTitle}>客服工单</Text><Text className={styles.traceCopy}>平台无在线聊天，客服采用表单流处理，支持文字与图片证据，回复记录会归档到工单。</Text></View>
  </BusinessPage>
}
export default Feedback
