// Unset ELECTRON_RUN_AS_NODE before launching electron-vite
// This env var is set by VSCode/Claude Code and prevents Electron from initializing properly
delete process.env.ELECTRON_RUN_AS_NODE

const { execSync } = require('child_process')
const args = process.argv.slice(2).join(' ')
const cmd = `electron-vite ${args || 'dev'}`

try {
  execSync(cmd, { stdio: 'inherit', env: process.env })
} catch (e) {
  process.exit(e.status || 1)
}
