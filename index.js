const pinyin = require("pinyin");

let cnMap = {}
let sourceLsit = []
class fuzzySearch {
  // 生成中文对应数据表
  formateCNMap(list) {
    console.log('list is', list, new Date().getTime())
    sourceLsit = list
    list.forEach((item, index) => {
      for (let i of item) {
        this.formateMapforCN(i, index)
        if (index === list.length - 1) {
          console.log('字符表', cnMap, new Date().getTime())
        }
        if (this.isCN(i)) {
          this.dismantleCN(i, index)
        }
      }
    })
  }
  isCN(item) {
    const cn = /[\u4e00-\u9fa5]/
    return cn.test(item)
  }
  // 拆解中文,根据拼音字母放入对应表中
  dismantleCN(cn, index) {
    const result = pinyin(cn, {style: pinyin.STYLE_NORMAL})[0][0]
    for (let i of result) {
      if (cnMap[i]) {
        if (cnMap[i].indexOf(index) < 0) {
          cnMap[i].push(index)
        }
      } else {
        cnMap[i] = [index]
      }
    }
  }
  // 生成以中文为key的表
  formateMapforCN(item, index) {
    if (cnMap[item]) {
      if (cnMap[item].indexOf(index) < 0) {
        cnMap[item].push(index)
      }
    } else {
      cnMap[item] = [index]
    }
  }
  search(keys) {
    console.log('key:', keys)
    let result = []
    let first = true
    if (!this.checkKey(keys)) {
      return []
    }
    for (const key of keys) {
      if (cnMap[key] && first) {
        result = cnMap[key]
        first = false
      } else if (cnMap[key]) {
        result = result.filter(function(v){ return cnMap[key].indexOf(v) > -1 })
      }
    }
    const data = this.keyToData(result)
    return data;
  }
  checkKey(keys) {
    for (const key of keys) {
      if (!cnMap.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }
  arrayUnique(list) {
    return Array.from(new Set(list))
  }
  keyToData(list) {
    let result = []
    list.forEach(item => {
      result.push(sourceLsit[item])
    })
    return result;
  }
}
const fuzzysearch = new fuzzySearch()
module.exports = fuzzysearch
