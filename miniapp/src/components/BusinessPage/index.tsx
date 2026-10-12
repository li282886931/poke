import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface DetailRow {
  label: string
  value: string
}

interface BusinessPageProps {
  title: string
  eyebrow?: string
  status?: string
  rows?: DetailRow[]
  children?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export const BusinessPage: React.FC<BusinessPageProps> = ({ title, eyebrow, status, rows, children, actionLabel, onAction }) => (
  <View className={styles.page}>
    {eyebrow && <Text className={styles.eyebrow}>{eyebrow}</Text>}
    <View className={styles.heading}><Text className={styles.title}>{title}</Text>{status && <Text className={styles.status}>{status}</Text>}</View>
    {children}
    {rows && <View className={styles.card}>{rows.map(row => <View className={styles.row} key={row.label}><Text className={styles.label}>{row.label}</Text><Text className={styles.value}>{row.value}</Text></View>)}</View>}
    {actionLabel && <View className={styles.action} onClick={onAction}>{actionLabel}</View>}
  </View>
)
