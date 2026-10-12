import { useState } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { categories } from '@/data/mock-data'
import { callFunction } from '@/services/cloud'
import styles from './index.module.scss'

const Publish = () => {
  const [category, setCategory] = useState(categories[0])
  const [title, setTitle] = useState('')
  const [district, setDistrict] = useState('高新区')
  const [time, setTime] = useState('今天 18:00 后')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    const cleanTitle = title.trim()
    const cleanDescription = description.trim()
    if (!cleanTitle || !cleanDescription) {
      Taro.showToast({ title: '请补充标题和需求描述', icon: 'none' })
      return
    }
    setSubmitting(true)
    try {
      const listing = await callFunction<{ id: string; status: string }>('createListing', {
        title: cleanTitle,
        category,
        district,
        time,
        description: cleanDescription,
      })
      Taro.showToast({ title: '已提交，等待核验', icon: 'success' })
      Taro.navigateTo({
        url: `/pages/publish-detail/index?id=${listing.id}&title=${encodeURIComponent(cleanTitle)}&category=${encodeURIComponent(category)}&district=${encodeURIComponent(district)}&time=${encodeURIComponent(time)}&status=${encodeURIComponent(listing.status || 'pending_review')}`,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return <View className={styles.page}>
    <Text className={styles.title}>发布需求</Text><Text className={styles.sub}>提交前将以脱敏视图向合规资源展示</Text>
    <View className={styles.voice} onClick={() => Taro.navigateTo({ url: '/pages/voice-confirm/index' })}><Text className={styles.voiceMark}>●</Text><View><Text className={styles.voiceTitle}>语音快速填写</Text><Text className={styles.voiceSub}>先识别，再由你确认结构化信息</Text></View><Text className={styles.chevron}>›</Text></View>
    <View className={styles.ruleBox}><Text className={styles.ruleTitle}>供需双池与 AI 确认</Text><Text className={styles.ruleCopy}>发布内容会进入需求池，资源供给也可反向匹配；低置信或多意图描述会先进入确认卡片，24 小时未确认自动关闭。</Text></View>
    <Text className={styles.label}>服务品类</Text><View className={styles.categories}>{categories.map(item => <Text className={category === item ? styles.active : styles.category} onClick={() => setCategory(item)} key={item}>{item}</Text>)}</View>
    <Text className={styles.label}>需求标题</Text><Input className={styles.input} value={title} placeholder="例如：空调不制冷，需要上门检修" onInput={(event: any) => setTitle(event.detail.value)} />
    <Text className={styles.label}>服务区域</Text><View className={styles.select}><Input className={styles.inlineInput} value={district} placeholder="高新区" onInput={(event: any) => setDistrict(event.detail.value)} /><Text>成都</Text></View>
    <Text className={styles.label}>服务时间</Text><Input className={styles.input} value={time} placeholder="例如：今天 18:00 后" onInput={(event: any) => setTime(event.detail.value)} />
    <Text className={styles.label}>需求描述</Text><Textarea className={styles.textarea} value={description} placeholder="描述故障、规格、可服务时间等信息" maxlength={300} onInput={(event: any) => setDescription(event.detail.value)} />
    <View className={styles.tip}>精确位置和联系方式仅用于匹配与合规解锁，不会在公开页展示；低于活跃资源阈值的品类会转为预约排队，不进入售卖。</View>
    <View className={styles.tip}>平台无在线聊天，师傅解锁后通过电话线下联系，关键事项请使用服务确认单留痕。</View>
    <View className={styles.action} onClick={() => !submitting && submit()}>{submitting ? '提交中' : '预览并提交'}</View>
  </View>
}
export default Publish
