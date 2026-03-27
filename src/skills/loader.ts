import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILLS_DIR = join(__dirname, '../../skills')

export interface Skill {
  name: string
  description: string
  content: string
  path: string
}

export interface SkillManifest {
  name: string
  description: string
  path: string
}

function parseSkillDescription(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (t && !t.startsWith('#')) return t
  }
  return ''
}

export function listSkills(): SkillManifest[] {
  if (!existsSync(SKILLS_DIR)) return []
  return readdirSync(SKILLS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const path = join(SKILLS_DIR, file)
      const content = readFileSync(path, 'utf-8')
      const name = file.replace('.md', '')
      const description = parseSkillDescription(content)
      return { name, description, path }
    })
}

export function loadSkill(name: string): Skill {
  const filename = name.endsWith('.md') ? name : `${name}.md`
  const path = join(SKILLS_DIR, filename)
  if (!existsSync(path)) {
    const available = listSkills().map(s => s.name).join(', ')
    throw new Error(`Skill "${name}" no encontrado. Disponibles: ${available}`)
  }
  const content = readFileSync(path, 'utf-8')
  const description = parseSkillDescription(content)
  return { name: name.replace('.md', ''), description, content, path }
}

export function loadSkillWithBase(name: string): string {
  const base = name === 'figma-use' ? '' : (() => {
    try { return loadSkill('figma-use').content + '\n\n---\n\n' }
    catch { return '' }
  })()
  return base + loadSkill(name).content
}
