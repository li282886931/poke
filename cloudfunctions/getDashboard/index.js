const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  try {
    const { OPENID: openid } = cloud.getWXContext()
    const [listings, matches, messages, account] = await Promise.all([
      db.collection('listings').where({ _openid: openid }).orderBy('updated_at', 'desc').limit(20).get(),
      db.collection('matches').where({ master_openid: openid }).orderBy('created_at', 'desc').limit(20).get(),
      db.collection('messages').where({ _openid: openid }).orderBy('created_at', 'desc').limit(30).get(),
      db.collection('credit_accounts').where({ _openid: openid }).limit(1).get(),
    ])
    return { code: 0, message: 'success', data: { residentListings: listings.data, masterMatches: matches.data, messages: messages.data, credit: account.data[0]?.available || 0 } }
  } catch (err) {
    console.error('[getDashboard]', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
