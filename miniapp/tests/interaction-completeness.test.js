const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8')
}

test('home page starts the voice demand confirmation flow directly', () => {
  const source = read('src/pages/index/index.tsx')

  assert.ok(source.includes('/pages/voice-confirm/index'), 'home voice entry should open voice confirmation')
  assert.ok(source.includes('onLongPress'), 'home voice orb should support long press recording')
  assert.ok(source.includes('onTouchEnd'), 'home voice orb should finish the voice action')
  assert.equal(source.includes('/pages/publish/index'), false, 'home should not route voice-first users through manual publishing')
})

test('voice confirmation submits recognized transcript to the matching api', () => {
  const source = read('src/pages/voice-confirm/index.tsx')

  assert.ok(source.includes('callFunction'), 'voice confirmation should call the service layer')
  assert.ok(source.includes('submitVoiceDemand'), 'voice confirmation should submit to voice demand api')
  assert.ok(source.includes('matched'), 'voice confirmation should handle matched results')
  assert.ok(source.includes('waiting'), 'voice confirmation should handle waiting results')
  assert.ok(source.includes('Taro.getCurrentInstance'), 'voice confirmation should read transcript from navigation params')
})

test('manual publishing submits structured demand to the listing api', () => {
  const source = read('src/pages/publish/index.tsx')

  assert.ok(source.includes('callFunction'), 'publish page should call the service layer')
  assert.ok(source.includes('createListing'), 'publish page should create a listing through the api')
  assert.ok(source.includes('useState'), 'publish page should keep editable form state')
  assert.ok(source.includes('提交中'), 'publish page should show an in-flight submit state')
  assert.ok(source.includes('Taro.showToast'), 'publish page should surface validation and submit feedback')
})
