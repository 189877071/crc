// 递归拷贝文件
const { mkdirSync, statSync, existsSync, readFileSync, writeFileSync, readdirSync, renameSync } = require('fs')
const { join } = require('path')
const { SCSS, LESS } = require('./actions')
/**
 * 拷贝目录或文件
 * @param {String} path 
 * @param {String} copyPath 
 */
function copy(path, copyPath) {
  if (!existsSync(path)) {
    error(`error: is not file/dir ${path} `)
    return
  }

  if (!existsSync(copyPath)) {
    mkdirSync(copyPath)
    success(`create ${copyPath} dir`)
  }

  const files = readdirSync(path)

  for (let i = 0; i < files.length; i++) {
    const iCopyPath = join(copyPath, files[i])
    const iPath = join(path, files[i])
    if (statSync(iPath).isFile()) {
      writeFileSync(iCopyPath, readFileSync(iPath))
      success(`create ${iCopyPath} file`)
    } else {
      copy(iPath, iCopyPath)
    }
  }
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

function copyFile(path, data) {
  const onoff = writeFileSync(path, data)
  if (onoff) {
    error(`error: create ${path} file failure`)
    throw Error(onoff)
  } else {
    success(`create ${path}`)
  }
}

function mkdirs(path, arr) {
  for (let i = 0; i < arr.length; i++) {
    path = join(path, arr[i])
    if (!existsSync(path)) {
      mkdirSync(path)
      success(`create ${path} dir`)
    }
  }
  return path
}

function getcrctoinfo(projectpath) {
  let packagedata
  try {
    packagedata = JSON.parse(readFileSync(join(projectpath, 'package.json')).toString())
  } catch (e) {
    error(`没有${join(projectpath, 'package.json')}文件`)
    throw Error(e)
  }
  if (!packagedata.crcto) {
    error(`${join(projectpath, 'package.json')}文件的标识数据不存在，无法继续执行操作`)
    throw Error('')
  }
  return packagedata.crcto
}

function getstylesname(style) {
  let stylename = 'styles.module' // 样式表名称
  switch (style) {
    case LESS:
      stylename += '.less'
      break
    case SCSS:
      stylename += '.scss'
      break
    default:
      stylename += '.css'
  }
  return stylename
}

module.exports = {
  copy,
  warning,
  error,
  success,
  readFileSync,
  writeFileSync,
  renameSync,
  existsSync,
  copyFile,
  mkdirSync,
  mkdirs,
  getcrctoinfo,
  getstylesname
}
