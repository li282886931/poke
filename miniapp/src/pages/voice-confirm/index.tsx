import { useState } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BusinessPage } from '@/components/BusinessPage'
import { callFunction } from '@/services/cloud'
import type { VoiceDemandResult } from '@/types/business'
import styles from './index.module.scss'

const fallbackTranscript = '我在成都高新区，需要冷库、吊车、维修或保洁资源。'

function getInitialTranscript() {
  // Taro.getCurrentInstance exists at miniapp runtime; local editor compat types are intentionally minimal.
  const runtime = Taro as typeof Taro & {
    getCurrentInstance: () => { router?: { params?: Record<string, string> } }
  }
  const params = runtime.getCurrentInstance().router?.params
  const transcript = params?.transcript ? decodeURIComponent(String(params.transcript)) : ''
  return transcript || fallbackTranscript
}

const VoiceConfirm = () => {
  const [transcript, setTranscript] = useState<string>(getInitialTranscript())
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<VoiceDemandResult | null>(null)

  const submit = async () => {
    const content = transcript.trim()
    if (!content) {
      Taro.showToast({ title: '请先补充需求内容', icon: 'none' })
      return
    }
    setSubmitting(true)
    try {
      const nextResult = await callFunction<VoiceDemandResult>('submitVoiceDemand', {
        transcript: content,
        userId: 'resident-01',
        city: '成都',
        durationSeconds: 6,
      })
      setResult(nextResult)
      Taro.showToast({ title: nextResult.status === 'matched' ? '已通知资源方' : '已进入等待匹配', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  const actionLabel = result
    ? result.status === 'matched'
      ? '查看匹配进度'
      : '返回首页'
    : submitting
      ? '提交中'
      : '确认并开始匹配'

  const handleAction = () => {
    if (submitting) return
    if (!result) {
      submit()
      return
    }
    if (result.status === 'matched') {
      Taro.redirectTo({ url: '/pages/matches/index' })
      return
    }
    Taro.redirectTo({ url: '/pages/index/index' })
  }

  return <BusinessPage title="确认识别结果" eyebrow="确认后才会进入资源池匹配" status={result?.status === 'matched' ? '已匹配' : result?.status === 'waiting' ? '等待匹配' : undefined} actionLabel={actionLabel} onAction={handleAction}>
    <View className={styles.transcript}>
      <Textarea
        className={styles.textarea}
        value={transcript}
        maxlength={300}
        onInput={(event: any) => setTranscript(event.detail.value)}
      />
      <Text className={styles.edit}>可编辑识别原文，系统只按确认后的内容匹配</Text>
    </View>
    <Text className={styles.label}>待识别字段</Text>
    <View className={styles.tags}><Text>品类</Text><Text>城市</Text><Text>区域</Text><Text>资源关键词</Text></View>
    {result && <View className={styles.result}>
      <Text className={styles.resultTitle}>{result.message}</Text>
      <Text className={styles.resultCopy}>识别：{result.category} · {result.city}{result.district ? ` · ${result.district}` : ''}</Text>
      {result.status === 'matched' && result.matches.map(match => (
        <View className={styles.match} key={match.resourceId}>
          <Text className={styles.matchName}>{match.name}</Text>
          <Text className={styles.matchMeta}>{match.district} · {match.reasons.join('、')} · {match.phone}</Text>
        </View>
      ))}
      {result.status === 'waiting' && <Text className={styles.resultCopy}>暂时没有合适资源，需求会继续留在等待匹配队列。</Text>}
    </View>}
    <View className={styles.secondary} onClick={() => Taro.navigateBack()}>重新说一次</View>
  </BusinessPage>
}

export default VoiceConfirm
