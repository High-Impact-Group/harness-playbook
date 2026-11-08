// Guards .claude/ against drift. Fails (exit 1) when:
//  - an agent or command names a model that is not on the allowed list, or has no model
//  - a gate agent or gate command disagrees with its pin in .claude/claude-config.json
//  - a review agent can write (its disallowedTools must include Write and Edit)
//  - an agent's name does not match its file, or a pinned agent has no file
//  - settings.json points at a hook file that does not exist
// Run from the repo root:  node scripts/check-claude-config.mjs
// Set CLAUDE_CONFIG_ROOT to check a copy somewhere else.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(process.env.CLAUDE_CONFIG_ROOT || process.cwd())
const dir = join(root, '.claude')
const cfg = JSON.parse(readFileSync(join(dir, 'claude-config.json'), 'utf8'))
const problems = []
const bad = (m) => problems.push(m)

function frontmatter(path) {
  const m = readFileSync(path, 'utf8').match(/^---\n([\s\S]*?)\n---/)
  const out = {}
  if (!m) return out
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z-]+):\s*(.*)$/)
    if (kv) out[kv[1]] = kv[2].trim().replace(/^(["'])(.*)\1$/, '$2')
  }
  return out
}
const list = (sub) => (existsSync(join(dir, sub)) ? readdirSync(join(dir, sub)).filter((f) => f.endsWith('.md')) : [])

const agents = new Set()
for (const f of list('agents')) {
  const name = f.slice(0, -3)
  agents.add(name)
  const fm = frontmatter(join(dir, 'agents', f))
  if (fm.name !== name) bad(`agents/${f}: name is "${fm.name}", the file says "${name}"`)
  if (!cfg.allowedModels.includes(fm.model)) bad(`agents/${f}: model "${fm.model ?? '(none)'}" is not on the allowed list`)
  const pin = cfg.gateAgents?.[name]
  if (pin) for (const k of ['model', 'effort']) if (fm[k] !== pin[k]) bad(`agents/${f}: ${k} is "${fm[k]}", the pin says "${pin[k]}"`)
  if (cfg.reviewAgents?.includes(name)) {
    const denied = (fm.disallowedTools ?? '').split(',').map((s) => s.trim())
    for (const tool of ['Write', 'Edit']) if (!denied.includes(tool)) bad(`agents/${f}: a review agent must disallow ${tool}`)
  }
}
for (const name of Object.keys(cfg.gateAgents ?? {})) if (!agents.has(name)) bad(`agents/${name}.md is pinned in the config but missing`)

for (const f of list('commands')) {
  const name = f.slice(0, -3)
  const fm = frontmatter(join(dir, 'commands', f))
  if (!cfg.allowedModels.includes(fm.model)) bad(`commands/${f}: model "${fm.model ?? '(none)'}" is not on the allowed list`)
  const pin = cfg.gateCommands?.[name]
  if (pin) for (const k of ['model', 'effort']) if (fm[k] !== pin[k]) bad(`commands/${f}: ${k} is "${fm[k]}", the pin says "${pin[k]}"`)
}

const settingsPath = join(dir, 'settings.json')
if (existsSync(settingsPath)) {
  for (const m of readFileSync(settingsPath, 'utf8').matchAll(/\.claude\/hooks\/([A-Za-z0-9._-]+)/g)) {
    if (!existsSync(join(dir, 'hooks', m[1]))) bad(`settings.json points at hooks/${m[1]}, which does not exist`)
  }
}

if (problems.length) {
  console.error(`check-claude-config: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log(`check-claude-config: ok (${agents.size} agents, ${list('commands').length} commands)`)
