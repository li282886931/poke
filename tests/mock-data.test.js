const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mock-data.ts')
const iconAssetsPath = path.join(__dirname, '..', 'src', 'data', 'icon-assets.ts')

function readMockData() {
  return fs.readFileSync(mockDataPath, 'utf8')
}

function countIds(source, prefix) {
  return Array.from(source.matchAll(new RegExp(`id: '${prefix}[^']+'`, 'g'))).length
}

test('development mock data covers rich list states', () => {
  const source = readMockData()

  assert.ok(countIds(source, 'lead-') >= 5, 'expected at least five resident listings')
  assert.ok(countIds(source, 'match-') >= 5, 'expected at least five master matches')
  assert.ok(countIds(source, 'msg-') >= 6, 'expected at least six message records')
})

test('development mock data includes broad service categories', () => {
  const source = readMockData()

  for (const category of ['设备租赁', '农机服务', '同城运输']) {
    assert.ok(source.includes(category), `missing category: ${category}`)
  }
})

test('development icon image assets exist and are wired into visible pages', () => {
  const iconSource = fs.readFileSync(iconAssetsPath, 'utf8')
  const pageSources = [
    'src/pages/index/index.tsx',
    'src/pages/messages/index.tsx',
    'src/pages/unlock/index.tsx',
    'src/pages/onboarding/index.tsx',
  ].map(file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')).join('\n')
  const iconFiles = Array.from(iconSource.matchAll(/@\/assets\/icons\/([^']+\.png)'/g), match => match[1])

  assert.ok(iconFiles.length >= 10, 'expected a visible icon image set')
  for (const fileName of iconFiles) {
    assert.ok(fs.existsSync(path.join(__dirname, '..', 'src', 'assets', 'icons', fileName)), `missing icon file: ${fileName}`)
  }
  assert.ok(pageSources.includes('categoryIcons'))
  assert.ok(pageSources.includes('messageIcons'))
  assert.ok(pageSources.includes('actionIcons'))
})
