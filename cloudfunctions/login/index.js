const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  try {
    const { OPENID: openid } = cloud.getWXContext()
    return { code: 0, message: 'success', data: { openid } }
  } catch (err) {
    console.error('[login]', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
