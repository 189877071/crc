const inquirer = require('inquirer')
const shell = require('shelljs')
const { join } = require('path')
const createPage = require('./createPage')
const cwd = process.cwd()
const { error, success, existsSync, copy, readFileSync, copyFile } = require('./uilt')

const { JS, TS, CSS, SCSS, LESS, Redux, MobX, none } = require('./actions')

const tspackage = require('./tspackage.json')

const jspackage = require('./jspackage.json')

const mobxindex = readFileSync(join(__dirname, '../template/index/mobxindex'))

const reduxindex = readFileSync(join(__dirname, '../template/index/reduxindex'))

const tsmobxstore = readFileSync(join(__dirname, '../template/store/tsmobxstore'))

const jsmobxstore = readFileSync(join(__dirname, '../template/store/jsmobxstore'))

const reduxcodeTypes = {
  "@types/react-redux": "^7.1.1",
  "@types/redux": "^3.6.0",
  "@types/redux-actions": "^2.6.1",
  "@types/redux-promise": "^0.5.28",
}

const reduxcode = {
  "react-redux": "^7.1.0",
  "redux": "^4.0.4",
  "redux-actions": "^2.6.5",
  "redux-promise": "^0.6.0",
}

const mobxcode = {
  "mobx": "^5.13.0",
  "mobx-react": "^6.1.1",
}

const prompt = async () => {
  return await inquirer.prompt([
    {
      type: 'list',
      name: 'lang',
      message: '选择使用的语音',
      choices: [JS, TS],
      default: TS
    },
    {
      type: 'list',
      name: 'style',
      message: '请选择css预处理工具',
      choices: [SCSS, LESS, CSS],
      default: SCSS
    },
    {
      type: 'list',
      name: 'provide',
      message: '请选择状态管理工具',
      choices: [Redux, MobX, none],
      default: MobX
    }
  ])
}

const installPrompt = async () => {
  return await inquirer.prompt([
    {
      type: 'confirm',
      name: 'install',
      message: '是否安装依赖包',
      default: true
    }
  ])
}

// 项目初始化
const projectinit = async (projectpath) => {
  shell.cd(projectpath)
  shell.exec('git init')
  shell.exec('git add .')
  shell.exec('git commit -m "初始化"')
  const { install } = await installPrompt()
  if (!install) {
    success('项目创建完成')
    return
  }
  console.log('Installing packages. This might take a couple of minutes.')
  const child = shell.exec('yarn', { async: true })
  child.stdout.on('data', (data) => {
    console.log(data)
    console.log('正在安装模块……')
  })
  child.stdout.on('end', () => success('项目创建完成'))
}

module.exports = async (name) => {
  if (!/^[a-z](?:@?[a-z0-9-_])*$/.test(name)) {
    error('项目必须以 /^[a-z](?:@?[a-z0-9-_])*$/ 规则来命名')
    return
  }

  if (existsSync(join(cwd, name))) {
    error(`${name}目录已存在，无法创建该项目`)
    return
  }

  const { lang, style, provide } = await prompt()

  let copypath = '' // 拷贝文件的路径
  let packagedata = {} // package.json的内容
  let projectpath = join(cwd, name) // 项目路径
  let index = '' // 入口文件内容
  let indexPath = join(projectpath, 'src/index') // 入口文件路径
  let reduxstorePath = '' // redux中的store路径
  let mobxstore = '' // mobx 的 store 内容
  let mobxstorePath = join(projectpath, 'src/store') // mobx 的 store 的路径

  switch (lang) {
    case TS:
      copypath = join(__dirname, '../template/ts')
      reduxstorePath = join(__dirname, '../template/store/tsreduxstore')
      mobxstore = tsmobxstore
      indexPath += '.tsx'
      mobxstorePath += '.ts'
      packagedata = tspackage
      break;
    case JS:
      copypath = join(__dirname, '../template/js')
      reduxstorePath = join(__dirname, '../template/store/jsreduxstore')
      mobxstore = jsmobxstore
      packagedata = jspackage
      indexPath += '.jsx'
      mobxstorePath += '.js'
      break;
  }

  // 拷贝打包文件
  copy(copypath, projectpath)

  switch (provide) {
    case Redux:
      index = reduxindex
      copy(reduxstorePath, join(projectpath, 'src/store'))
      packagedata.dependencies = { ...packagedata.dependencies, ...reduxcode }
      if (lang === TS) packagedata.dependencies = { ...packagedata.dependencies, ...reduxcodeTypes }
      break
    case MobX:
      index = mobxindex
      copyFile(mobxstorePath, mobxstore)
      packagedata.dependencies = { ...packagedata.dependencies, ...mobxcode }
      break
    default:
      index = mobxindex
  }

  packagedata.name = name
  packagedata.crcto = { lang, style, provide }
  // 创建 package.json 文件
  copyFile(join(projectpath, 'package.json'), JSON.stringify(packagedata))
  // 创建 index.ts/index.js 入口文件
  copyFile(indexPath, index)
  // 创建app组件
  if (!createPage(projectpath, ['app'])) return
  // 初始化项目
  projectinit(projectpath)
}