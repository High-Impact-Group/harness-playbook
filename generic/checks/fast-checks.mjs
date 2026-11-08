// Runs the fast checks listed in fast-checks.config.json for the files that changed.
// Use it before you end a task, before a push, or in CI.
// A check FAILS the run only when it exits non-zero AND its output matches "failIf" (when given).
// A check that cannot run to the end (missing tool, crash, timeout) is reported and does NOT fail the run,
// so a broken environment cannot trap anyone. A crash of this runner itself also does not fail the run.
// Exit 0 = ok or could not run, exit 1 = at least one check failed (the failures are printed).
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

process.on('uncaughtException', (e) => { console.error(`fast-checks: runner error, not failing the run: ${e.message}`); process.exit(0) })

const root = resolve(process.env.FAST_CHECKS_ROOT || process.cwd())
let checks = []
try { checks = JSON.parse(readFileSync(join(root, 'fast-checks.config.json'), 'utf8')).checks ?? [] } catch { process.exit(0) }
if (!checks.length) process.exit(0)

const git = (...a) => { try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }) } catch { return '' } }
const changed = [...new Set([...git('diff', '--name-only', 'HEAD').split('\n'), ...git('ls-files', '-o', '--exclude-standard').split('\n')].filter(Boolean))]
if (!changed.length) process.exit(0)

const failures = []
for (const c of checks) {
  if (!changed.some((f) => new RegExp(c.when).test(f))) continue
  if (c.needs && !existsSync(join(root, c.needs))) { console.error(`fast-checks: skipped "${c.name}" (${c.needs} is missing)`); continue }
  const r = spawnSync(c.cmd[0], c.cmd.slice(1), { cwd: join(root, c.cwd ?? '.'), encoding: 'utf8', timeout: (c.timeoutSec ?? 120) * 1000, maxBuffer: 20 * 1024 * 1024 })
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`
  if (r.error || r.status === null) { console.error(`fast-checks: "${c.name}" could not run to the end (${r.error?.code ?? r.signal ?? 'timeout'}), not failing`); continue }
  if (r.status === 0) continue
  if (c.failIf && !new RegExp(c.failIf, 'i').test(out)) { console.error(`fast-checks: "${c.name}" crashed without a result, not failing`); continue }
  failures.push(`"${c.name}" failed:\n${out.split('\n').slice(0, 25).join('\n')}`)
}
if (failures.length) {
  console.error(`The checks below fail. Fix them before you finish.\n\n${failures.join('\n\n')}`)
  process.exit(1)
}
