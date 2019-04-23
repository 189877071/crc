// 递归拷贝文件
const { mkdirSync, statSync, existsSync, readFileSync, writeFileSync, readdirSync } = require('fs')
const { join } = require('path')

/**
 * 拷贝目录或文件
 * @param {String} path 
 * @param {String} copyPath 
 */
function copy(path, copyPath) {
  if(!existsSync(path)) {
    error(`${path}文件/目录不存在`)
    return
  }
  
  if(!existsSync(copyPath)) {
    mkdirSync(copyPath)
    success(`创建${copyPath}目录`)
  }

  const files = readdirSync(path)

  for(let i=0; i<files.length; i++) {
    const iCopyPath = join(copyPath, files[i])
    const iPath = join(path, files[i])
    if(statSync(iPath).isFile()) {
      writeFileSync(iCopyPath, readFileSync(iPath))
      success(`创建${iCopyPath}文件`)
    } else {
      copy(iPath, iCopyPath)
    }
  }
}

/**
 * 创建class组件
 * @param {String} cwd
 * @param {Array} path
 * @param {Boolean} true为函数式组件false为class组件
 */
function createComponent(cwd, path, f) {
  if(!existsSync(cwd)) {
    error(`没有${cwd}目录`)
    return
  }

  const name = path[path.length - 1]
  const [ctop, copm, cfunc, styles] = [
`import React, { PureComponent } from 'react'
import styles from './styles.scss'
interface Props {
  text: string;
}
`,
`
export default class ${name} extends PureComponent<Props, {}> {
  render() {
    return (
      <div className={styles.box}>
        我是${name}组件
      </div>
    )
  }
}
`,
`
export default (props: Props) => {
  return (
    <div className={styles.box}>我是${name}组件</div>
  )
}
`,
`
@import '../../assets/common';
.box {
  font-size: 36px;
  color: rgb(7, 140, 149);
}
`
  ]

  for(let i=0; i<path.length; i++) {
    const newCwd = join(cwd, path[i])
    if(!existsSync(newCwd)) {
      mkdirSync(newCwd)
      success(`创建${newCwd}目录`)
    }
    cwd = newCwd
  }
  
  const index = ctop + (f ? cfunc : copm)
  const indexPath = join(cwd, 'index.tsx')
  const stylesPath = join(cwd, 'styles.scss')
  if(existsSync(indexPath) || existsSync(stylesPath) ) {
    error('该组件可能已存在，无法继续创建')
    return
  }
  writeFileSync(indexPath, index)
  success(`创建${indexPath}文件`)
  writeFileSync(stylesPath, styles)
  success(`创建${stylesPath}文件`)
}

function warning(str) {
  console.log('\x1B[33m%s\x1B[39m', str)
}

function error(str) {
  console.log('\x1B[31m%s\x1B[39m', str)
}

function success(str) {
  console.log('\x1B[32m%s\x1B[39m', str)
}

module.exports = {
  copy,
  existsSync,
  createComponent,
  warning,
  error,
  success,
  readFileSync,
  writeFileSync
}
