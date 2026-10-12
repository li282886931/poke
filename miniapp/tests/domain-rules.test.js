const test = require('node:test')
const assert = require('node:assert/strict')

const {
  canUnlockMatch,
  getListingActions,
} = require('../src/domain/rules')

test('only the priority owner can unlock during an active priority window', () => {
  const result = canUnlockMatch({
    matchStatus: 'priority',
    priorityOwnerId: 'master-01',
    currentUserId: 'master-02',
    listingStatus: 'matching',
  })

  assert.deepEqual(result, {
    allowed: false,
    reason: '优先窗口内，仅优先师傅可解锁',
  })
})

test('a pending review listing can be edited and withdrawn but not closed', () => {
  assert.deepEqual(getListingActions('pending_review'), ['edit', 'withdraw'])
})
