import { copyFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const sourceDir = path.join(rootDir, 'node_modules', 'vite', 'misc')
const targetDir = path.join(
  rootDir,
  '.vercel',
  'output',
  'functions',
  '__fallback.func',
  'node_modules',
  'vite',
  'misc',
)

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function copyIfPresent(fileName) {
  const sourcePath = path.join(sourceDir, fileName)
  const targetPath = path.join(targetDir, fileName)

  if (!(await exists(sourcePath))) {
    return
  }

  await mkdir(targetDir, { recursive: true })
  await copyFile(sourcePath, targetPath)
}

await copyIfPresent('true.js')
await copyIfPresent('false.js')
