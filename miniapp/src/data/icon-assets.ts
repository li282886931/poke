import actionVoice from '@/assets/icons/action-voice.png'
import categoryAgri from '@/assets/icons/category-agri.png'
import categoryClean from '@/assets/icons/category-clean.png'
import categoryEquipment from '@/assets/icons/category-equipment.png'
import categoryLabor from '@/assets/icons/category-labor.png'
import categoryRenovation from '@/assets/icons/category-renovation.png'
import categoryRepair from '@/assets/icons/category-repair.png'
import categoryTransport from '@/assets/icons/category-transport.png'
import messageMatch from '@/assets/icons/message-match.png'
import messageReview from '@/assets/icons/message-review.png'
import messageSystem from '@/assets/icons/message-system.png'
import messageUnlock from '@/assets/icons/message-unlock.png'
import statusSuccess from '@/assets/icons/status-success.png'
import type { Message } from '@/types/business'

export const categoryIcons: Record<string, string> = {
  家电维修: categoryRepair,
  家政保洁: categoryClean,
  局部家装: categoryRenovation,
  劳务服务: categoryLabor,
  设备租赁: categoryEquipment,
  农机服务: categoryAgri,
  同城运输: categoryTransport,
}

export const messageIcons: Record<Message['type'], string> = {
  match: messageMatch,
  review: messageReview,
  unlock: messageUnlock,
  system: messageSystem,
}

export const actionIcons = {
  voice: actionVoice,
  success: statusSuccess,
}
