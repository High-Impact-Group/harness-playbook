// Stop. Runs the fast checks listed under "stopChecks" in .claude/claude-config.json before Claude ends a turn.
// Exit 2 sends Claude back to work with the failures on stderr (Claude Code stops after 8 blocks in a row).
// A check blocks only when it fails in the way "failIf" names. A crash, a missing tool or a timeout is
// reported on stderr and never blocks, so a broken environment cannot trap a session.
// Each check: { name, when (regex on changed files), cmd [..], cwd?, needs?, env?, timeoutSec?, failIf? }
import { spawnSync, execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

process.on('uncaughtException', (e) => { console.error(`stop-checks: hook error, blocking: ${e.message}`); process.exit(2) })

const root = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd())
let checks = []
try { checks = JSON.parse(readFileSync(join(root, '.claude/claude-config.json'), 'utf8')).stopChecks ?? [] } catch { process.exit(0) }
if (!checks.length) process.exit(0)

const git = (...a) => { try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }) } catch { return '' } }
const changed = [...new Set([...git('diff', '--name-only', 'HEAD').split('\n'), ...git('ls-files', '-o', '--exclude-standard').split('\n')].filter(Boolean))]
if (!changed.length) process.exit(0)

const failures = []
for (const c of checks) {
  const re = new RegExp(c.when)
  if (!changed.some((f) => re.test(f))) continue
  if (c.needs && !existsSync(join(root, c.needs))) { console.error(`stop-checks: skipped "${c.name}" (${c.needs} is missing)`); continue }
  const r = spawnSync(c.cmd[0], c.cmd.slice(1), { cwd: join(root, c.cwd ?? '.'), encoding: 'utf8', timeout: (c.timeoutSec ?? 120) * 1000, env: { ...process.env, ...(c.env ?? {}) }, maxBuffer: 20 * 1024 * 1024 })
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`
  if (r.error || r.status === null) { console.error(`stop-checks: "${c.name}" could not run to the end (${r.error?.code ?? r.signal ?? 'timeout'}), not blocking`); continue }
  if (r.status === 0) continue
  if (c.failIf && !new RegExp(c.failIf, 'i').test(out)) { console.error(`stop-checks: "${c.name}" crashed without a result, not blocking`); continue }
  failures.push(`"${c.name}" failed:\n${out.split('\n').slice(0, 25).join('\n')}`)
}
if (failures.length) {
  console.error(`The checks below fail. Fix them before you finish.\n\n${failures.join('\n\n')}`)
  process.exit(2)
}
process.exit(0)
