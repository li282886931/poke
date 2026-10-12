const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const pagePath = path.join(__dirname, '..', 'src', 'pages', 'index', 'index.tsx')
const stylePath = path.join(__dirname, '..', 'src', 'pages', 'index', 'index.module.scss')

test('home page is voice-first and does not render data-heavy lists', () => {
  const source = fs.readFileSync(pagePath, 'utf8')

  assert.ok(source.includes('按住说话，说出你的需求'))
  assert.ok(source.includes('全国资源实时对接中'))
  assert.ok(source.includes('发布'))
  assert.equal(source.includes('residentListings.map'), false)
  assert.equal(source.includes('categories.map'), false)
  assert.equal(source.includes('listCard'), false)
  assert.equal(source.includes('priorityCard'), false)
})

test('home page styles include the large voice orb treatment', () => {
  const source = fs.readFileSync(stylePath, 'utf8')

  assert.ok(source.includes('.voiceOrb'))
  assert.ok(source.includes('.orbit'))
  assert.ok(source.includes('.liveStatus'))
})
