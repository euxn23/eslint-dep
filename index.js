#!/usr/bin/env node

const fs = require('fs')
const { exec } = require('child_process')
const ESLINTRC = `${process.cwd()}/.eslintrc`
const ESLINTRC_JS = `${ESLINTRC}.js`
const ESLINTRC_JSON = ESLINTRC
const ESLINTRC_YML = `${ESLINTRC}.yml`

const main = async () => {
  if (fs.existsSync(ESLINTRC_JS)) {
    const eslintrc = require(ESLINTRC)
    execute(eslintrc)
  } else if (fs.existsSync(ESLINTRC_JSON)) {
    const eslintrc = JSON.parse(fs.readFileSync(ESLINTRC_JSON, 'utf-8'))
    execute(eslintrc)
  } else if (fs.existsSync(ESLINTRC_YML)) {
    const yaml = require('js-yaml')
    const eslintrc = yaml.safeLoad(fs.readFileSync(ESLINTRC_YML, 'utf-8'))
    execute(eslintrc)
  } else {
    throw new Error('eslintrc not fount')
  }
}

// (eslintrc: Object) => void
const execute = eslintrc => {
  const modules = []
  modules.push(...[eslintrc.parser])
  if (Array.isArray(eslintrc.plugins)) {
    modules.push(...eslintrc.plugins.map(name => `eslint-plugin-${name}`))
  }
  if (Array.isArray(eslintrc.extends)) {
    modules.push(
      ...eslintrc.extends
        .map(p => p.split('/')[0])
        .filter(Boolean)
        .map(
          p => (p.match(/^plugin:(.+)$/) ? p.replace(':', '-') : `config-${p}`)
        )
        .map(name => `eslint-${name}`)
    )
  }
  if (eslintrc.overrides) {
    modules.push(...[eslintrc.overrides.parser])
    if (Array.isArray(eslintrc.overrides.plugins)) {
      modules.push(
        ...eslintrc.overrides.plugins.map(name => `eslint-plugin-${name}`)
      )
    }
    if (Array.isArray(eslintrc.overrides.extends)) {
      modules.push(
        ...eslintrc.overrides.extends
          .map(p => p.split('/')[0])
          .filter(Boolean)
          .map(
            p =>
              p.match(/^plugin:(.+)$/) ? p.replace(':', '-') : `config-${p}`
          )
          .map(name => `eslint-${name}`)
      )
    }
  }

  const joinedModules = [...new Set(modules)].join(' ')
  const errorHandler = (err, stdout, stderr) => {
    if (err) throw err
    if (stderr) console.warn(stderr)
  }
  const command = fs.existsSync('./yarn.lock')
    ? `yarn add -D ${joinedModules}`
    : `npm install -D ${joinedModules}`
  console.log(command)
  exec(command, errorHandler)
}

main().catch(err => console.error(err.stack))
