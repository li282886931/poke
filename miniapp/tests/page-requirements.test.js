const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const files = [
  'src/pages/profile/index.tsx',
  'src/pages/credits/index.tsx',
  'src/pages/feedback/index.tsx',
  'src/pages/matches/index.tsx',
  'src/pages/publish/index.tsx',
]

function readPages() {
  return files
    .map(file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8'))
    .join('\n')
}

test('pages expose the v4 customer-service and traceability requirements', () => {
  const source = readPages()

  for (const text of ['联系客服', '客服工单', '服务确认单', '无在线聊天', '72 小时四选一']) {
    assert.ok(source.includes(text), `missing page text: ${text}`)
  }
})

test('pages expose the v4 credit and supply-demand requirements', () => {
  const source = readPages()

  for (const text of ['人工充值', '额度效率', '已解锁数', '有效率', '退款率', '单条有效线索成本', '供需双池', '预约排队', '资源可用状态']) {
    assert.ok(source.includes(text), `missing page text: ${text}`)
  }
})
