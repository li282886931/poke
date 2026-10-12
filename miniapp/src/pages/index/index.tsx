import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BottomNav } from '@/components/BottomNav'
import { actionIcons } from '@/data/icon-assets'
import { useSession } from '@/store/session'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const { role, setRole } = useSession()
  const isMaster = role === 'master'

  const goPublish = () => Taro.navigateTo({ url: '/pages/publish/index' })
  const goMessages = () => Taro.redirectTo({ url: '/pages/messages/index' })
  const goMatches = () => Taro.redirectTo({ url: '/pages/matches/index' })

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.menuButton}>
          <View className={styles.menuLine} />
          <View className={styles.menuLine} />
          <View className={styles.menuLine} />
        </View>

        <View className={styles.brandWrap}>
          <View className={styles.logoMark}>
            <Text className={styles.logoText}>万</Text>
          </View>
          <View>
            <Text className={styles.brand}>万栖源</Text>
            <Text className={styles.subtitle}>全国资源 · 一键对接</Text>
          </View>
        </View>

        <View className={styles.headerActions}>
          <View className={styles.bellButton} onClick={goMessages}>
            <View className={styles.bellDot} />
            <Text>通知</Text>
          </View>
          <View className={styles.publishButton} onClick={goPublish}>
            <Text className={styles.plus}>+</Text>
            <Text>发布</Text>
          </View>
        </View>
      </View>

      <View className={styles.hero}>
        <View className={styles.voiceStage} onClick={goPublish}>
          <View className={styles.orbit} />
          <View className={styles.orbitSoft} />
          <View className={styles.voiceOrb}>
            <Image className={styles.voiceIcon} src={actionIcons.voice} />
          </View>
        </View>

        <Text className={styles.mainTitle}>按住说话，说出你的需求</Text>
        <Text className={styles.example}>例如：我在成都，急需 500 平米冷库</Text>

        <View className={styles.voiceHint}>
          <View className={styles.wave}>
            {Array.from({ length: 18 }).map((_, index) => (
              <View className={styles.waveDot} key={index} />
            ))}
          </View>
          <Text>长按光球开始 · 松手自动识别</Text>
        </View>
      </View>

      <View className={styles.liveStatus} onClick={goMatches}>
        <View className={styles.liveDot} />
        <Text className={styles.liveText}>全国资源实时对接中...</Text>
        <Text className={styles.liveBadge}>LIVE</Text>
      </View>

      <View className={styles.modeSwitch}>
        <Text
          className={!isMaster ? styles.modeActive : styles.mode}
          onClick={() => setRole('resident')}
        >
          找资源
        </Text>
        <Text
          className={isMaster ? styles.modeActive : styles.mode}
          onClick={() => setRole('master')}
        >
          接需求
        </Text>
      </View>

      <View className={styles.quickBubble} onClick={goPublish}>
        <Image className={styles.quickIcon} src={actionIcons.voice} />
        <View className={styles.quickBadge} />
      </View>

      <BottomNav active="home" />
    </View>
  )
}

export default Index
