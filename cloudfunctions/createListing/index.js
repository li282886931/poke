const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async event => {
  try {
    const { OPENID: openid } = cloud.getWXContext()
    const { title, category, district, description, specs = [] } = event
    if (!title || !category || !district) throw new Error('请完整填写标题、品类和服务区域')
    const result = await db.collection('listings').add({
      data: { _openid: openid, title, category, district, description: description || '', specs, status: 'pending_review', created_at: db.serverDate(), updated_at: db.serverDate() },
    })
    return { code: 0, message: 'success', data: { id: result._id, status: 'pending_review' } }
  } catch (err) {
    console.error('[createListing]', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
