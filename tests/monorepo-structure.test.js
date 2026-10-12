const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')

test('miniapp is isolated in its own project folder', () => {
  assert.ok(fs.existsSync(path.join(root, 'miniapp', 'package.json')))
  assert.ok(fs.existsSync(path.join(root, 'miniapp', 'src', 'app.tsx')))
  assert.ok(fs.existsSync(path.join(root, 'miniapp', 'config', 'index.ts')))
  assert.equal(fs.existsSync(path.join(root, 'src', 'app.tsx')), false)
  assert.equal(fs.existsSync(path.join(root, 'config', 'index.ts')), false)
})

test('go backend lives in server folder with environment example', () => {
  assert.ok(fs.existsSync(path.join(root, 'server', 'go.mod')))
  assert.ok(fs.existsSync(path.join(root, 'server', '.env.example')))
  assert.ok(fs.existsSync(path.join(root, 'server', 'cmd', 'api', 'main.go')))
})
