const { readFileSync, existsSync, error, copyFile, success, mkdirs, getcrctoinfo, getstylesname } = require('./uilt')

const { join } = require('path')

const { TS } = require('./actions')

module.exports = (projectpath, names, isfunc) => {
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

  if (!existsSync(join(projectpath, 'src/components'))) {
    error(`error: create failure`)
    return false
  }

  if (existsSync(join(projectpath, `src/components/${names.join('/')}`))) {
    error('该组件已经存在')
    return false
  }

  const { lang, style } = getcrctoinfo(projectpath)
  
  let pathstr = isfunc ? `../template/function/${lang === TS ? 'ts' : 'js'}` : `../template/page/${lang === TS ? 'tspage' : 'jspage'}`

  let data = readFileSync(join(__dirname, pathstr)).toString()
  // 样式表名称
  let stylename = getstylesname(style)

  const compPath = mkdirs(join(projectpath, `src/components`), names)

  data = data.toString().replace('{{style}}', stylename).replace(/\{\{name\}\}/gi, name)

  copyFile(join(compPath, `index.${lang === TS ? 'tsx' : 'jsx'}`), data)

  copyFile(join(compPath, stylename), '')
  
  success(`${name}组件创建成功`)
}

