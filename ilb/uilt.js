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
    throw new Error(`${path}文件/目录不存在`)
  }
  
  if(!existsSync(copyPath)) {
    mkdirSync(copyPath)
  }

  const files = readdirSync(path)

  for(let i=0; i<files.length; i++) {
    const iCopyPath = join(copyPath, files[i])
    const iPath = join(path, files[i])
    if(statSync(iPath).isFile()) {
      writeFileSync(iCopyPath, readFileSync(iPath))
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
    throw new Error(`没有${cwd}目录`)
  }
  const name = path[path.length - 1]
  const [ctop, copm, cfunc, styles] = [
`
import React, { PureComponent } from 'react'
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
    }
    cwd = newCwd
  }

  if(existsSync(join(cwd, 'index.tsx')) || existsSync(join(cwd, 'styles.scss')) ) {
    throw new Error('该组件可能已存在，无法继续创建')
  }

  const index = ctop + (f ? cfunc : copm)

  writeFileSync(join(cwd, 'index.tsx'), index)
  writeFileSync(join(cwd, 'styles.scss'), styles)
}

function createFunction(cwd, path) {

}
module.exports = {
  copy,
  existsSync,
  createComponent
}
