const listingActions = {
  draft: ['edit', 'submit'],
  pending_review: ['edit', 'withdraw'],
  pending_confirmation: ['edit', 'confirm'],
  matching: ['pause', 'close', 'appeal'],
  sellable: ['pause', 'close', 'appeal'],
  closed: ['republish'],
  expired: ['republish'],
}

function canUnlockMatch({ matchStatus, priorityOwnerId, currentUserId, listingStatus }) {
  if (listingStatus !== 'matching' && listingStatus !== 'sellable') {
    return { allowed: false, reason: '该线索已失效，暂不可解锁' }
  }
  if (matchStatus === 'priority' && priorityOwnerId !== currentUserId) {
    return { allowed: false, reason: '优先窗口内，仅优先师傅可解锁' }
  }
  if (matchStatus === 'expired') {
    return { allowed: false, reason: '该匹配已失效' }
  }
  return { allowed: true, reason: '' }
}

function getListingActions(status) {
  return listingActions[status] || []
}

module.exports = {
  canUnlockMatch,
  getListingActions,
}
