import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BottomNav } from '@/components/BottomNav'
import { messageIcons } from '@/data/icon-assets'
import { messages } from '@/data/mock-data'
import styles from './index.module.scss'

const Messages: React.FC = () => {
  const [mode, setMode] = useState<'all' | 'unread'>('all')
  const visible = mode === 'unread' ? messages.filter(item => !item.read) : messages
  return <View className={styles.page}>
    <View className={styles.top}><Text className={styles.title}>消息</Text><Text className={styles.clear} onClick={() => Taro.showToast({ title: '已全部标为已读', icon: 'none' })}>全部已读</Text></View>
    <View className={styles.tabs}><Text className={mode === 'all' ? styles.active : styles.tab} onClick={() => setMode('all')}>全部</Text><Text className={mode === 'unread' ? styles.active : styles.tab} onClick={() => setMode('unread')}>未读</Text></View>
    {visible.map(item => <View className={styles.item} key={item.id} onClick={() => Taro.navigateTo({ url: item.type === 'match' ? '/pages/match-detail/index' : '/pages/publish-detail/index' })}>
      <Image className={styles.marker} src={messageIcons[item.type]} />
      <View className={styles.content}><View className={styles.row}><Text className={styles.itemTitle}>{item.title}</Text><Text className={styles.time}>{item.time}</Text></View><Text className={styles.copy}>{item.content}</Text></View>
      {!item.read && <Text className={styles.dot} />}
    </View>)}
    <BottomNav active="messages" />
  </View>
}
export default Messages
