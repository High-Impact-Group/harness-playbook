// A command guard. Give it a shell command as arguments or on stdin. It exits 2 when the command is on the short
// block list, and 0 when it is allowed. It READS the command like a shell would (quotes, separators, wrappers,
// "bash -c"), so `rm -rf .cache` and `echo "git push --force"` pass.
// Blocks: plain force pushes (the lease form passes); recursive force deletes of protected paths;
// piping a download into a shell; closing keywords ("fixes #12") in commit and pull request text.
// A crash of the guard blocks the command (exit 2). A guard that fails open is not a guard.
//
//   node checks/guard-command.mjs git push --force
//   echo 'rm -rf /' | node checks/guard-command.mjs
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

process.on('uncaughtException', (e) => { console.error(`guard error, blocking: ${e.message}`); process.exit(2) })
process.on('unhandledRejection', (e) => { console.error(`guard error, blocking: ${e}`); process.exit(2) })

const input = process.argv.length > 2 ? process.argv.slice(2).join(' ') : readFileSync(0, 'utf8')
const block = (why) => { console.error(`BLOCKED: ${why}. Propose a safer alternative.`); process.exit(2) }

const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash'])
const WRAPPERS = new Set(['sudo', 'command', 'time', 'nohup', 'nice', 'env', 'exec', 'xargs', 'timeout'])
const KEYWORDS = new Set(['if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{', '}', '(', ')', 'fi', 'done'])
const home = homedir()
const PROTECTED = new Set(['/', '/*', '~', '~/', '$HOME', '${HOME}', home, '.', './', '..', '../', '*', './*', '.git'])

// Split into pipelines of segments on unquoted separators, and segments into tokens on unquoted spaces.
function parse(s) {
  const segments = []
  let tokens = [], cur = '', has = false, q = '', pipeNext = false
  const endTok = () => { if (has) tokens.push(cur); cur = ''; has = false }
  const endSeg = (isPipe) => { endTok(); if (tokens.length) segments.push({ tokens, pipedInto: pipeNext }); tokens = []; pipeNext = isPipe }
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (q) { if (c === q) q = ''; else if (c === '\\' && q === '"' && i + 1 < s.length) cur += s[++i]; else cur += c; continue }
    if (c === '"' || c === "'") { q = c; has = true; continue }
    if (c === '\\' && i + 1 < s.length) { cur += s[++i]; has = true; continue }
    if (c === '|' ) { endSeg(true); if (s[i + 1] === '|') i++; if (s[i] === '|' && s[i - 1] === '|') pipeNext = false; continue }
    if (c === ';' || c === '\n' || c === '&') { endSeg(false); continue }
    if (c === '(' || c === ')' || c === '{' || c === '}') { endTok(); tokens.push(c); continue }
    if (/\s/.test(c)) { endTok(); continue }
    cur += c; has = true
  }
  endSeg(false)
  return segments
}

function strip(tokens) {
  let t = [...tokens]
  for (;;) {
    while (t.length && (KEYWORDS.has(t[0]) || /^[A-Za-z_][A-Za-z0-9_]*=/.test(t[0]))) t.shift()
    if (t.length && WRAPPERS.has(t[0])) { t.shift(); while (t.length && t[0].startsWith('-')) t.shift(); continue }
    return t
  }
}

function inspect(text, depth = 0) {
  if (depth > 4) return
  const segs = parse(text)
  let sawDownload = false
  for (const seg of segs) {
    const t = strip(seg.tokens)
    const cmd = (t[0] ?? '').split('/').pop()
    const args = t.slice(1)
    if (SHELLS.has(cmd)) {
      const i = args.findIndex((a) => /^-[a-z]*c$/.test(a))
      if (i >= 0 && args[i + 1]) inspect(args[i + 1], depth + 1)
      else if (seg.pipedInto && sawDownload) block('piping a download into a shell')
      continue
    }
    if (cmd === 'curl' || cmd === 'wget') sawDownload = true
    if (cmd === 'git') {
      const sub = args.find((a) => !a.startsWith('-'))
      if (sub === 'push') {
        const force = args.some((a) => a === '--force' || a === '-f' || (/^-[a-z]*f[a-z]*$/.test(a) && !a.startsWith('--')) || /^\+\S/.test(a))
        const lease = args.some((a) => a.startsWith('--force-with-lease'))
        if (force && !lease) block('a plain force push (use --force-with-lease)')
      }
      if (sub === 'commit' && closing(args.join(' '))) block('a closing keyword in a commit message (write "refs #N")')
    }
    if (cmd === 'gh') {
      const sub = `${args[0] ?? ''} ${args[1] ?? ''}`
      if (/^(pr|issue) (create|edit|comment)$/.test(sub) && closing(args.join(' '))) block('a closing keyword in pull request or issue text (write "refs #N")')
    }
    if (cmd === 'rm') {
      const flags = args.filter((a) => a.startsWith('-')).join('')
      const recursive = /r|R/.test(flags) || args.includes('--recursive')
      const force = /f/.test(flags) || args.includes('--force')
      if (recursive && force) for (const a of args.filter((x) => !x.startsWith('-'))) {
        if (PROTECTED.has(a) || PROTECTED.has(resolve(a)) || /^\/(\*)?$/.test(a)) block(`recursive force delete of ${a}`)
      }
    }
  }
}
function closing(text) { return /\b(close[sd]?|fix(e[sd])?|resolve[sd]?)\s*:?\s+#\d+/i.test(text) }

inspect(input)
process.exit(0)
