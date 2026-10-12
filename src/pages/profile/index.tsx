import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { BottomNav } from '@/components/BottomNav'
import { useSession } from '@/store/session'
import styles from './index.module.scss'

const Profile: React.FC = () => {
  const { role, credit, setRole, loggedIn, login } = useSession()
  const master = role === 'master'
  const accountItems = master
    ? ['认证与服务范围', '我的资源', '排期与可用状态', '证照更新']
    : ['我的发布', '服务确认单', '我的收藏', '城市与隐私设置']
  const serviceItems = master
    ? ['额度账户', '解锁记录', '72 小时反馈', '私域备忘录']
    : ['客服工单', '申诉仲裁', '双向评价', '预约排队']
  const actions = master
    ? [['联系客服', '/pages/feedback/index'], ['设置', '/pages/feedback/index']]
    : [['联系客服', '/pages/feedback/index'], ['设置', '/pages/feedback/index']]
  return <View className={styles.page}>
    <View className={styles.profileHead}>
      <View className={styles.avatar}>万</View>
      <View><Text className={styles.name}>{loggedIn ? '万栖源用户' : '个人中心'}</Text><Text className={styles.desc}>{master ? '家电维修师傅 · 已实名认证 · L2 熟手' : '居民用户 · 已实名认证 · 信用良好'}</Text></View>
      {!loggedIn && <Text className={styles.login} onClick={() => { login(); Taro.showToast({ title: '登录成功', icon: 'success' }) }}>登录</Text>}
    </View>
    <View className={styles.roleCard}><View><Text className={styles.roleTitle}>{master ? '师傅工作台' : '居民工作台'}</Text><Text className={styles.roleDesc}>{master ? `可用额度 ${credit}，资源可用状态正常` : '发布真实需求，获取脱敏资源匹配'}</Text></View><Text className={styles.switch} onClick={() => setRole(master ? 'resident' : 'master')}>切换身份</Text></View>
    <View className={styles.stats}><View><Text className={styles.num}>{master ? credit : 2}</Text><Text className={styles.label}>{master ? '可用额度' : '进行中发布'}</Text></View><View><Text className={styles.num}>{master ? 68 : 3}</Text><Text className={styles.label}>{master ? '线索有效率' : '资源响应'}</Text></View><View><Text className={styles.num}>0</Text><Text className={styles.label}>待处理申诉</Text></View></View>
    <View className={styles.panel}><Text className={styles.panelTitle}>账号与服务</Text><View className={styles.grid}>{accountItems.map(label => <View className={styles.gridItem} key={label} onClick={() => Taro.navigateTo({ url: label === '认证与服务范围' ? '/pages/onboarding/index' : '/pages/publish-detail/index' })}><Text>{label}</Text></View>)}</View></View>
    <View className={styles.panel}><Text className={styles.panelTitle}>资产与履约</Text><View className={styles.grid}>{serviceItems.map(label => <View className={styles.gridItem} key={label} onClick={() => Taro.navigateTo({ url: label === '额度账户' ? '/pages/credits/index' : '/pages/feedback/index' })}><Text>{label}</Text></View>)}</View></View>
    <View className={styles.boundary}><Text className={styles.boundaryTitle}>沟通与留痕边界</Text><Text className={styles.boundaryCopy}>平台无在线聊天，供需双方仅在解锁后电话联系；客服工单、服务确认单、72 小时反馈和评价用于争议留痕。</Text></View>
    <View className={styles.menu}>{actions.map(([label, url]) => <View className={styles.menuItem} key={label} onClick={() => Taro.navigateTo({ url })}><Text>{label}</Text><Text className={styles.chevron}>›</Text></View>)}</View>
    <BottomNav active="profile" />
  </View>
}
export default Profile
