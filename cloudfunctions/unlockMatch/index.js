const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const command = db.command

exports.main = async event => {
  try {
    const { OPENID: openid } = cloud.getWXContext()
    const { matchId, idempotencyKey } = event
    if (!matchId || !idempotencyKey) throw new Error('解锁请求无效')
    const result = await db.runTransaction(async transaction => {
      const existing = await transaction.collection('unlock_records').where({ _openid: openid, idempotency_key: idempotencyKey }).get()
      if (existing.data.length) return existing.data[0]
      const match = await transaction.collection('matches').doc(matchId).get()
      if (!match.data || match.data.status === 'expired') throw new Error('线索已失效')
      const accountQuery = await transaction.collection('credit_accounts').where({ _openid: openid }).limit(1).get()
      const account = accountQuery.data[0]
      if (!account || account.available < match.data.credit_cost) throw new Error('可用额度不足')
      await transaction.collection('credit_accounts').doc(account._id).update({ data: { available: command.inc(-match.data.credit_cost), updated_at: db.serverDate() } })
      const created = await transaction.collection('unlock_records').add({ data: { _openid: openid, match_id: matchId, idempotency_key: idempotencyKey, status: 'unlocked', credit_cost: match.data.credit_cost, created_at: db.serverDate() } })
      return { id: created._id, status: 'unlocked' }
    })
    return { code: 0, message: 'success', data: result }
  } catch (err) {
    console.error('[unlockMatch]', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
