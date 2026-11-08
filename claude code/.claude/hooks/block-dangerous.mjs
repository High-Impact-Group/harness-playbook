// PreToolUse (Bash). Blocks a short list of destructive commands.
// Reads the command like a shell would (quotes, separators, wrappers, `bash -c`), so `rm -rf .cache`
// and `echo "git push --force"` pass. Blocks: plain force pushes (the lease form passes), recursive force
// deletes of protected paths, piping a download into a shell, and closing keywords ("fixes #12") in commit
// and pull request text. Exit 2 blocks and sends the reason to Claude.
// A crash of this hook BLOCKS the command. A guard that fails open is not a guard.
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

process.on('uncaughtException', (e) => { console.error(`hook error, blocking: ${e.message}`); process.exit(2) })
process.on('unhandledRejection', (e) => { console.error(`hook error, blocking: ${e}`); process.exit(2) })

const input = JSON.parse(readFileSync(0, 'utf8'))
const cmd = String(input?.tool_input?.command ?? '')
const block = (why) => { console.error(`BLOCKED: ${why}. Propose a safer alternative.`); process.exit(2) }

const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash'])
const WRAPPERS = new Set(['sudo', 'command', 'time', 'nohup', 'nice', 'env', 'exec', 'xargs', 'timeout'])
const KEYWORDS = new Set(['if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{', '}', '(', ')', 'fi', 'done'])
const home = homedir()
const PROTECTED = new Set(['/', '/*', '~', '~/', '$HOME', '${HOME}', home, '.', './', '..', '../', '*', './*', '.git'])

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
    if (c === '|') { const dbl = s[i + 1] === '|'; endSeg(!dbl); if (dbl) i++; continue }
    if (c === ';' || c === '\n' || c === '&') { endSeg(false); continue }
    if (c === '(' || c === ')' || c === '{' || c === '}') { endTok(); tokens.push(c); continue }
    if (/\s/.test(c)) { endTok(); continue }
    cur += c; has = true
  }
  endSeg(false)
  return segments
}

function strip(tokens) {
  const t = [...tokens]
  for (;;) {
    while (t.length && (KEYWORDS.has(t[0]) || /^[A-Za-z_][A-Za-z0-9_]*=/.test(t[0]))) t.shift()
    if (t.length && WRAPPERS.has(t[0])) { t.shift(); while (t.length && t[0].startsWith('-')) t.shift(); continue }
    return t
  }
}
const closing = (text) => /\b(close[sd]?|fix(e[sd])?|resolve[sd]?)\s*:?\s+#\d+/i.test(text)

function inspect(text, depth = 0) {
  if (depth > 4) return
  let sawDownload = false
  for (const seg of parse(text)) {
    const t = strip(seg.tokens)
    const c = (t[0] ?? '').split('/').pop()
    const args = t.slice(1)
    if (SHELLS.has(c)) {
      const i = args.findIndex((a) => /^-[a-z]*c$/.test(a))
      if (i >= 0 && args[i + 1]) inspect(args[i + 1], depth + 1)
      else if (seg.pipedInto && sawDownload) block('piping a download into a shell')
      continue
    }
    if (c === 'curl' || c === 'wget') sawDownload = true
    if (c === 'git') {
      const sub = args.find((a) => !a.startsWith('-'))
      if (sub === 'push') {
        const force = args.some((a) => a === '--force' || a === '-f' || (/^-[a-z]*f[a-z]*$/.test(a) && !a.startsWith('--')) || /^\+\S/.test(a))
        if (force && !args.some((a) => a.startsWith('--force-with-lease'))) block('a plain force push (use --force-with-lease)')
      }
      if (sub === 'commit' && closing(args.join(' '))) block('a closing keyword in a commit message (write "refs #N")')
    }
    if (c === 'gh' && /^(pr|issue) (create|edit|comment)$/.test(`${args[0] ?? ''} ${args[1] ?? ''}`) && closing(args.join(' '))) block('a closing keyword in pull request or issue text (write "refs #N")')
    if (c === 'rm') {
      const flags = args.filter((a) => a.startsWith('-')).join('')
      if ((/[rR]/.test(flags) || args.includes('--recursive')) && (/f/.test(flags) || args.includes('--force'))) {
        for (const a of args.filter((x) => !x.startsWith('-'))) if (PROTECTED.has(a) || PROTECTED.has(resolve(a))) block(`recursive force delete of ${a}`)
      }
    }
  }
}
inspect(cmd)
process.exit(0)
