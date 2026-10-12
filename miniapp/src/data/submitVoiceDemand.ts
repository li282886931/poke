import type { VoiceDemandResult } from '@/types/business'

const matchedKeywords = ['冷库', '吊车', '叉车', '空调', '保洁', '运输', '冷链']

function inferCategory(transcript: string) {
  if (['冷库', '吊车', '叉车', '设备'].some(keyword => transcript.includes(keyword))) return '设备租赁'
  if (['空调', '洗衣机', '冰箱', '维修'].some(keyword => transcript.includes(keyword))) return '家电维修'
  if (['保洁', '清洁', '打扫'].some(keyword => transcript.includes(keyword))) return '家政保洁'
  if (['运输', '冷链', '货车'].some(keyword => transcript.includes(keyword))) return '同城运输'
  return '综合资源'
}

export default (data: Record<string, unknown> = {}): VoiceDemandResult => {
  const transcript = String(data.transcript || '我在成都高新区，需要空调维修师傅今天上门。')
  const matched = matchedKeywords.some(keyword => transcript.includes(keyword))
  const category = inferCategory(transcript)

  return {
    leadId: `voice-lead-${Date.now()}`,
    status: matched ? 'matched' : 'waiting',
    message: matched ? '已匹配到合适资源，正在通知资源方联系你' : '暂时没有合适资源，已进入等待匹配',
    transcript,
    category,
    city: String(data.city || '成都'),
    district: transcript.includes('高新区') ? '高新区' : String(data.district || ''),
    matches: matched
      ? [
          {
            resourceId: 'mock-resource-001',
            name: `${category}资源方`,
            category,
            district: transcript.includes('高新区') ? '高新区' : '成都',
            score: 92,
            reasons: ['品类匹配', '城市匹配', '关键词匹配'],
            notificationStatus: 'queued',
            phone: '平台代通知',
          },
        ]
      : [],
  }
}
