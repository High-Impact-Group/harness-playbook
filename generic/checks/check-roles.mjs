// Fails when a role file disagrees with checks/roles.config.json.
// Checks: every role has a file and every file has a role; the header names the same role as the file;
// model, effort and access match the pin; a model is on the allowed list; a read-only role stays read-only.
// Run from the kit root:  node checks/check-roles.mjs
// Exit 0 = ok, exit 1 = at least one problem (printed to stderr).
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = process.env.KIT_ROOT || join(here, '..')
const cfg = JSON.parse(readFileSync(join(here, 'roles.config.json'), 'utf8'))
const problems = []
const bad = (m) => problems.push(m)

function header(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/)
  const out = {}
  if (!m) return out
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z-]+):\s*(.*)$/)
    if (kv) out[kv[1]] = kv[2].trim()
  }
  return out
}

const files = readdirSync(join(root, 'roles')).filter((f) => f.endsWith('.md'))
const seen = new Set()
for (const f of files) {
  const name = f.replace(/\.md$/, '')
  seen.add(name)
  const h = header(readFileSync(join(root, 'roles', f), 'utf8'))
  const pin = cfg.roles[name]
  if (!pin) { bad(`${f}: no entry in roles.config.json`); continue }
  if (h.role !== name) bad(`${f}: header says role "${h.role}", file says "${name}"`)
  if (!cfg.allowedModels.includes(h.model)) bad(`${f}: model "${h.model}" is not on the allowed list`)
  if (!cfg.allowedEfforts.includes(h.effort)) bad(`${f}: effort "${h.effort}" is not on the allowed list`)
  if (!cfg.allowedAccess.includes(h.access)) bad(`${f}: access "${h.access}" is not on the allowed list`)
  for (const k of ['model', 'effort', 'access']) if (h[k] !== pin[k]) bad(`${f}: ${k} is "${h[k]}", the pin says "${pin[k]}"`)
  if (cfg.readOnlyRoles.includes(name) && h.access !== 'read-only') bad(`${f}: a read-only role gained write access`)
}
for (const name of Object.keys(cfg.roles)) if (!seen.has(name)) bad(`roles/${name}.md is listed in the config but missing`)

if (problems.length) {
  console.error(`check-roles: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log(`check-roles: ok (${files.length} roles)`)
