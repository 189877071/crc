// 创建容器组件
const { readFileSync, existsSync, error, copyFile, success, mkdirs, getcrctoinfo, getstylesname } = require('./uilt')

const { join } = require('path')

const { TS, SCSS, LESS, Redux, MobX } = require('./actions')

const tsmobxpage = readFileSync(join(__dirname, '../template/page/tsmobxpage'))

const tsreduxpage = readFileSync(join(__dirname, '../template/page/tsreduxpage'))

const jsmobxpage = readFileSync(join(__dirname, '../template/page/jsmobxpage'))

const jsreduxpage = readFileSync(join(__dirname, '../template/page/jsreduxpage'))

const tspage = readFileSync(join(__dirname, '../template/page/tspage'))

const jspage = readFileSync(join(__dirname, '../template/page/jspage'))

module.exports = (projectpath, names) => {
  if (!names || !Array.isArray(names) || !names.length) {
    error(`请指定组件名称`)
    return false
  }
  
  names = names.map(name => name.substr(0, 1).toLocaleUpperCase() + name.substr(1))

  let name = names[names.length - 1]

  if (!/^[a-zA-Z](?:@?[a-z0-9-_])*$/.test(name)) {
    error('组件必须以 /^[a-zA-Z](?:@?[a-z0-9-_])*$/ 规则来命名')
    return false
  }

  if (!existsSync(join(projectpath, 'src/views'))) {
    error(`error: create failure`)
    return false
  }
  
  if (existsSync(join(projectpath, `src/views/${names.join('/')}`))) {
    error('该组件已经存在')
    return false
  }

  const { lang, style, provide } = getcrctoinfo(projectpath)

  let data = '' // 组件内容
  let postfix = '' // 后缀
  // 判断使用哪个文件
  if (lang === TS) {
    postfix = '.tsx'
    switch (provide) {
      case MobX:
        data = tsmobxpage
        break
      case Redux:
        data = tsreduxpage
        break
      default:
        data = tspage
    }
  } else {
    postfix = '.jsx'
    switch (provide) {
      case MobX:
        data = jsmobxpage
        break
      case Redux:
        data = jsreduxpage
        break
      default:
        data = jspage
    }
  }
  // 样式表名称
  let stylename = getstylesname(style)

  const compPath = mkdirs(join(projectpath, `src/views`), names)

  data = data.toString().replace('{{style}}', stylename).replace(/\{\{name\}\}/gi, name)

  copyFile(join(compPath, `index${postfix}`), data)
  copyFile(join(compPath, stylename), '')
  success(`${name}组件创建成功`)
  return true
}