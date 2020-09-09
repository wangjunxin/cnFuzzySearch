const pinyin = require("pinyin");

let cnMap = {}
let sourceList = []
class fuzzySearch {
  // 生成中文对应数据表,list:输入的城市列表
  formateCNMap(list) {
    console.log('list is', list, new Date().getTime())
    sourceList = list
    list.forEach((item, index) => {
      for (let i of item) {
        this.formateMapforCN(i, index)
        if (index === list.length - 1 && item === item.length - 1) {
          console.log('字符表', cnMap, new Date().getTime())
        }
        if (this.isCN(i)) {
          this.dismantleCN(i, index)
        }
      }
    })
  }
  // 判断是否中文
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
  // 生成以中文为key的表，item:城市名中单字，index:城市在列表中index
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
    // 搜索关键词中单key在表中不存在，表明没有符合的结果
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
    const data = this.keyToCityData(result, keys)
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
  keyToCityData(list, keys) {
    let result = []
    list.forEach(item => {
      const cityName = sourceList[item]
      if (this.checkSearchKeySequence(cityName, keys)) {
        result.push(cityName)
      }
    })
    return result;
  }
  // 判断结果与搜索字段的顺序
  checkSearchKeySequence(cityName, keys) {
    let result = this.cnTranslatePinyin(cityName)
    let flag = true
    for (let keyItem of keys) {
      let keyIndex = -1
      let pin = ''
      if (this.isCN(keyItem)) {
        pin = pinyin(keyItem, {style: pinyin.STYLE_NORMAL})[0][0]
      } else {
        pin = keyItem
      }
      keyIndex = result.indexOf(pin)
      if (keyIndex > -1) {
        result = result.substring(keyIndex + pin.length, result.length)
      } else {
        flag = false
      }
    }
    return flag
  }
  // 中文转拼音
  cnTranslatePinyin(cityName) {
    let result = ''
    for (let item of cityName) {
      if (this.isCN(item)) {
        result += pinyin(item, {style: pinyin.STYLE_NORMAL})[0][0]
      } else {
        result += item
      }
    }
    return result
  }
}
const fuzzysearch = new fuzzySearch()
module.exports = fuzzysearch
