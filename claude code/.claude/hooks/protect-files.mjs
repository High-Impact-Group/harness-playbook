// PreToolUse (Edit, Write, MultiEdit). Blocks edits to secrets, lock files and keys.
// Example files (.env.example, *.example) are allowed. Add your own patterns under "protectedPatterns"
// in .claude/claude-config.json (regular expressions matched against the file path).
// A crash of this hook BLOCKS the edit.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

process.on('uncaughtException', (e) => { console.error(`hook error, blocking: ${e.message}`); process.exit(2) })
process.on('unhandledRejection', (e) => { console.error(`hook error, blocking: ${e}`); process.exit(2) })

const input = JSON.parse(readFileSync(0, 'utf8'))
const path = String(input?.tool_input?.file_path ?? '')
let extra = []
const cfg = join(process.env.CLAUDE_PROJECT_DIR || process.cwd(), '.claude', 'claude-config.json')
if (existsSync(cfg)) extra = JSON.parse(readFileSync(cfg, 'utf8')).protectedPatterns ?? []

const name = path.split('/').pop() ?? ''
if (/\.example$|\.sample$|\.template$/.test(name)) process.exit(0)
const BUILT_IN = [/(^|\/)\.env($|\.)/, /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|Gemfile\.lock|Cargo\.lock|composer\.lock)$/, /\.(pem|key|p12|pfx)$/, /(^|\/)id_(rsa|ed25519|ecdsa)(\.pub)?$/]
const hit = [...BUILT_IN, ...extra.map((p) => new RegExp(p))].find((re) => re.test(path))
if (hit) { console.error(`BLOCKED: ${path} is a protected file (secrets, lock files and keys). Ask the owner to change it.`); process.exit(2) }
process.exit(0)
