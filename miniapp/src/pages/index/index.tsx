import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BottomNav } from '@/components/BottomNav'
import { actionIcons } from '@/data/icon-assets'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const goPublish = () => Taro.navigateTo({ url: '/pages/publish/index' })

  return (
    <View className={styles.page}>
      <View className={styles.brandWrap}>
        <View className={styles.logoMark}>
          <Text className={styles.logoText}>万</Text>
        </View>
        <Text className={styles.brand}>万栖源</Text>
      </View>

      <View className={styles.hero}>
        <View className={styles.voiceStage} onClick={goPublish}>
          <View className={styles.orbit} />
          <View className={styles.orbitSoft} />
          <View className={styles.voiceOrb}>
            <Image className={styles.voiceIcon} src={actionIcons.voice} />
          </View>
        </View>

        <Text className={styles.mainTitle}>说出你的需求</Text>
        <Text className={styles.example}>比如：我在成都，需要冷库、吊车、维修或保洁</Text>

        <View className={styles.voiceHint}>
          <View className={styles.wave}>
            {Array.from({ length: 16 }).map((_, index) => (
              <View className={styles.waveDot} key={index} />
            ))}
          </View>
          <Text>长按光球，说完松手</Text>
        </View>
      </View>

      <View className={styles.matchFlow}>
        <Text>系统会去资源池匹配</Text>
        <Text>有合适的资源方会联系你</Text>
        <Text>暂时没有就继续等待匹配</Text>
      </View>

      <BottomNav active="home" />
    </View>
  )
}

export default Index
