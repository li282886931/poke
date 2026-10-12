const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const appConfigPath = path.join(__dirname, '..', 'src', 'app.config.ts')
const appPath = path.join(__dirname, '..', 'src', 'app.tsx')
const cloudServicePath = path.join(__dirname, '..', 'src', 'services', 'cloud.ts')

test('native tabBar is not configured because bottom nav is rendered in-page', () => {
  const source = fs.readFileSync(appConfigPath, 'utf8')

  assert.equal(source.includes('tabBar'), false)
})

test('app does not initialize cloud development with placeholder env id', () => {
  const source = fs.readFileSync(appPath, 'utf8')

  assert.equal(source.includes('replace-with-cloudbase-env-id'), false)
})

test('runtime source does not reference process env in mini program bundles', () => {
  const runtimeSources = [appPath, cloudServicePath]
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n')

  assert.equal(runtimeSources.includes('process.env'), false)
})
