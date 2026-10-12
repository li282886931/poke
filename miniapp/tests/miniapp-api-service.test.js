const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const servicePath = path.join(root, 'src', 'services', 'cloud.ts')

test('miniapp service calls the go api before falling back to local mock', () => {
  const source = fs.readFileSync(servicePath, 'utf8')

  assert.ok(source.includes('Taro.request'), 'service should call the Go HTTP API')
  assert.ok(source.includes('/api/v1/dashboard'), 'dashboard endpoint should be wired')
  assert.ok(source.includes('/api/v1/listings'), 'listing creation endpoint should be wired')
  assert.ok(source.includes('/api/v1/unlocks'), 'unlock endpoint should be wired')
  assert.ok(source.includes('/api/v1/voice-demands'), 'voice demand endpoint should be wired')
  assert.ok(source.includes('submitVoiceDemand'), 'voice demand service name should be wired')
  assert.ok(source.includes('loadLocalMock'), 'service should keep local mock fallback')
  assert.equal(source.includes('process.env'), false, 'mini program runtime must not read process.env')
})

test('voice demand has a local mock fallback payload', () => {
  const mockPath = path.join(root, 'src', 'data', 'submitVoiceDemand.ts')
  const source = fs.readFileSync(mockPath, 'utf8')

  assert.ok(source.includes('matched'), 'mock should cover successful matching')
  assert.ok(source.includes('waiting'), 'mock should cover waiting state')
  assert.ok(source.includes('transcript'), 'mock should echo the recognized transcript')
  assert.ok(source.includes('matches'), 'mock should expose resource matches for the result screen')
})
