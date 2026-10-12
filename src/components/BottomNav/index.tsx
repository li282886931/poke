import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { categoryIcons, messageIcons } from '@/data/icon-assets'
import styles from './index.module.scss'

type TabKey = 'home' | 'matches' | 'messages' | 'profile'

interface NavItem {
  key: TabKey
  label: string
  url: string
  icon: string
  badge?: string
}

const navItems: NavItem[] = [
  { key: 'home', label: '首页', url: '/pages/index/index', icon: categoryIcons['家电维修'] },
  { key: 'matches', label: '匹配', url: '/pages/matches/index', icon: messageIcons.match, badge: '12' },
  { key: 'messages', label: '消息', url: '/pages/messages/index', icon: messageIcons.system, badge: '2' },
  { key: 'profile', label: '我的', url: '/pages/profile/index', icon: categoryIcons['劳务服务'] },
]

export const BottomNav: React.FC<{ active: TabKey }> = ({ active }) => (
  <View className={styles.nav}>
    {navItems.map(item => (
      <View
        className={active === item.key ? styles.itemActive : styles.item}
        key={item.key}
        onClick={() => active !== item.key && Taro.redirectTo({ url: item.url })}
      >
        <View className={styles.iconWrap}>
          <Image className={styles.icon} src={item.icon} />
          {item.badge && <Text className={styles.badge}>{item.badge}</Text>}
        </View>
        <Text className={styles.label}>{item.label}</Text>
      </View>
    ))}
  </View>
)
