const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const pagePath = path.join(__dirname, '..', 'src', 'pages', 'index', 'index.tsx')
const stylePath = path.join(__dirname, '..', 'src', 'pages', 'index', 'index.module.scss')

test('home page is voice-first and does not render data-heavy lists', () => {
  const source = fs.readFileSync(pagePath, 'utf8')

  assert.ok(source.includes('说出你的需求'))
  assert.ok(source.includes('系统会去资源池匹配'))
  assert.ok(source.includes('有合适的资源方会联系你'))
  assert.ok(source.includes('暂时没有就继续等待匹配'))
  assert.equal(source.includes('residentListings.map'), false)
  assert.equal(source.includes('categories.map'), false)
  assert.equal(source.includes('listCard'), false)
  assert.equal(source.includes('priorityCard'), false)
  assert.equal(source.includes('liveStatus'), false)
  assert.equal(source.includes('modeSwitch'), false)
  assert.equal(source.includes('quickBubble'), false)
  assert.equal(source.includes('bellButton'), false)
  assert.equal(source.includes('publishButton'), false)
})

test('home page styles include the large voice orb treatment', () => {
  const source = fs.readFileSync(stylePath, 'utf8')

  assert.ok(source.includes('.voiceOrb'))
  assert.ok(source.includes('.orbit'))
  assert.ok(source.includes('.matchFlow'))
  assert.equal(source.includes('.liveStatus'), false)
  assert.equal(source.includes('.modeSwitch'), false)
  assert.equal(source.includes('.quickBubble'), false)
})
