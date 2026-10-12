import React from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BottomNav } from '@/components/BottomNav'
import { actionIcons, categoryIcons } from '@/data/icon-assets'
import { categories, residentListings } from '@/data/mock-data'
import { useSession } from '@/store/session'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const { role, setRole } = useSession()
  const isMaster = role === 'master'

  const goPublish = () => Taro.navigateTo({ url: '/pages/publish/index' })
  const openListing = () => Taro.navigateTo({ url: '/pages/publish-detail/index?id=lead-001' })
  const openMatch = () => Taro.navigateTo({ url: '/pages/match-detail/index?id=match-001' })

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View>
          <Text className={styles.city}>成都 · 高新区</Text>
          <Text className={styles.brand}>万栖源</Text>
        </View>
        <View className={styles.headerRight}>
          <Text className={styles.notice}>2</Text>
          <Text className={styles.icon} onClick={() => Taro.redirectTo({ url: '/pages/messages/index' })}>消息</Text>
        </View>
      </View>

      <View className={styles.roleBar}>
        <Text className={!isMaster ? styles.roleActive : styles.role} onClick={() => setRole('resident')}>我是居民</Text>
        <Text className={isMaster ? styles.roleActive : styles.role} onClick={() => setRole('master')}>我是师傅</Text>
      </View>

      {isMaster ? (
        <View className={styles.masterHero}>
          <View>
            <Text className={styles.eyebrow}>今日服务工作台</Text>
            <Text className={styles.heroTitle}>有 2 个匹配待处理</Text>
            <Text className={styles.heroDesc}>认证已通过 · 服务范围正常 · 可用额度 36</Text>
          </View>
          <View className={styles.heroButton} onClick={() => Taro.redirectTo({ url: '/pages/matches/index' })}>去处理</View>
        </View>
      ) : (
        <View className={styles.residentHero} onClick={goPublish}>
          <Text className={styles.eyebrow}>需要什么服务？</Text>
          <Text className={styles.heroTitle}>说一说，快速发布需求</Text>
          <Text className={styles.heroDesc}>识别结果需由你确认后才会参与匹配</Text>
          <View className={styles.voiceButton}><Text>按住说话</Text><Image className={styles.mic} src={actionIcons.voice} /></View>
        </View>
      )}

      <View className={styles.sectionHeading}>
        <Text className={styles.sectionTitle}>{isMaster ? '优先处理' : '常用发布'}</Text>
        <Text className={styles.more} onClick={goPublish}>{isMaster ? '查看全部' : '手动填写'}</Text>
      </View>
      {isMaster ? (
        <View className={styles.priorityCard} onClick={openMatch}>
          <View className={styles.priorityTop}><Text className={styles.tag}>优先窗口</Text><Text className={styles.timer}>剩余 09:42</Text></View>
          <Text className={styles.cardTitle}>空调不制冷，需要上门检修</Text>
          <Text className={styles.cardMeta}>家电维修 · 高新区 · 1.2 - 2.0 km</Text>
          <Text className={styles.cardMeta}>今天 18:00 后 · 消耗 8 额度</Text>
        </View>
      ) : (
        <ScrollView className={styles.categoryScroll} scrollX>
          <View className={styles.categories}>
            {categories.map(category => (
              <View className={styles.category} key={category} onClick={goPublish}>
                <Image className={styles.categoryMark} src={categoryIcons[category]} />
                <Text>{category}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <View className={styles.sectionHeading}>
        <Text className={styles.sectionTitle}>{isMaster ? '附近可响应' : '我的进行中需求'}</Text>
        <Text className={styles.more} onClick={() => Taro.redirectTo({ url: '/pages/matches/index' })}>查看匹配</Text>
      </View>
      {!isMaster && residentListings.map(item => (
        <View className={styles.listCard} key={item.id} onClick={openListing}>
          <View className={styles.listTop}><Text className={styles.tag}>{item.category}</Text><Text className={styles.status}>匹配中</Text></View>
          <Text className={styles.cardTitle}>{item.title}</Text>
          <Text className={styles.cardMeta}>{item.district} · {item.time}</Text>
          <View className={styles.listFoot}><Text>{item.createdAt} 发布</Text><Text>已有 3 个资源响应</Text></View>
        </View>
      ))}
      {isMaster && residentListings.map(item => (
        <View className={styles.listCard} key={item.id} onClick={openMatch}>
          <View className={styles.listTop}><Text className={styles.tag}>{item.category}</Text><Text className={styles.status}>可响应</Text></View>
          <Text className={styles.cardTitle}>{item.title}</Text>
          <Text className={styles.cardMeta}>{item.district} · {item.distance} · {item.time}</Text>
        </View>
      ))}
      <BottomNav active="home" />
    </View>
  )
}

export default Index
