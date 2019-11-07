export function getRandomStr() {
  return (new Date()).valueOf() + Math.random().toString(36).substr(2);
}


/**
 * 数字补零
 *
 * @param {*} num
 * @param {number} [n=2]
 * @returns
 */
function pad(num, n = 2) {
  num = '' + num;
  return Array(n > num.length ? n - num.length + 1 : 0).join('0') + num;
};


/**
 * @param type 字符串，要检测的类型的字符串
 * @return 类型检测函数
 * 根据传入的数据类型，返回该类型的类型检测函数
 * 类型检测使用 toString 函数
 */
function isType(type) {
  return function (val) {
    if (Object.prototype.toString.call(val) === `[object ${type}]`) {
      return true;
    }
    return false;
  };
}

export let isString = isType('String');
export let isNumber = isType('Number');

/**
 * 通过
 *
 * @export
 * @param {number} [milSecond=0]
 * @returns
 */
export function getConsumedTime(time = 0, options) {
  let comsumedDate = new Date(time - 8 * 3600 * 1000),
    regex = /DD|D|hh|h|mm|m|ss|s|SSS|S/,
    defaultOptions = {
      showZero: false,
      defaultReturn: '0秒',
      format: 'Dhms',
      unit: {D: '天', h: '小时', m: '分钟', s: '秒', S: '毫秒'}
    };
  defaultOptions = {...defaultOptions, ...options};
  if (time === 0) {
    return defaultOptions.defaultReturn;
  }
  let resultStr = defaultOptions.format,
    formatFuncs = {
      D: () => comsumedDate.getDate() - 1 + defaultOptions.unit['D'],
      DD: () => pad(comsumedDate.getDate() - 1) + defaultOptions.unit['D'],
      h: () => comsumedDate.getHours() + defaultOptions.unit['h'],
      hh: () => pad(comsumedDate.getHours()) + defaultOptions.unit['h'],
      m: () => comsumedDate.getMinutes() + defaultOptions.unit['m'],
      mm: () => pad(comsumedDate.getMinutes()) + defaultOptions.unit['m'],
      s: () => comsumedDate.getSeconds() + defaultOptions.unit['s'],
      ss: () => pad(comsumedDate.getSeconds()) + defaultOptions.unit['s'],
      S: () => comsumedDate.getMilliseconds() + defaultOptions.unit['S'],
      SSS: () => pad(comsumedDate.getMilliseconds(), 3) + defaultOptions.unit['S'],
    };
  while (regex.test(resultStr)) {
    resultStr = resultStr.replace(regex, (type) => {
      let val = formatFuncs[type]();
      if (parseInt(val, 10) <= 0) {
        return '';
      }
      return val;
    });
  }
  return resultStr;
}


/**
 * YY YYYY
 * M MM MMM MMMM
 * D DD
 * d dd ddd dddd
 * h hh
 * m mm
 * s ss
 *
 * @param {*} date
 */
export function dateFormat(date, regStr = 'YYYY-MM-DD') {
  if (isString(date)) {
    date = new Date(parseInt(date));
  }
  if (isNumber(date)) {
    date = new Date(date);
  }
  if (!isValidDate(date)) {
    return 'Invalid Date';
  }
  const regex = /YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|d|hh|h|mm|m|ss|s/;
  const locale = {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  };
  const formatFuncs = {
    YYYY: date => date.getFullYear(),
    YY: date => (date.getFullYear() + '').slice(2),
    M: date => date.getMonth() + 1,
    MM: date => pad(date.getMonth() + 1),
    MMM: date => locale.monthsShort[date.getMonth()],
    MMMM: date => locale.months[date.getMonth()],
    D: date => date.getDate(),
    DD: date => pad(date.getDate()),
    d: date => date.getDay(),
    dd: date => locale.weekdaysMin[date.getDay()],
    ddd: date => locale.weekdaysShort[date.getDay()],
    dddd: date => locale.weekdays[date.getDay()],
    h: date => date.getHours(),
    hh: date => pad(date.getHours()),
    m: date => date.getMinutes(),
    mm: date => pad(date.getMinutes()),
    s: date => date.getSeconds(),
    ss: date => pad(date.getSeconds()),
  };
  let resultStr = regStr;
  while (regex.test(resultStr)) {
    resultStr = resultStr.replace(regex, (type) => {
      return formatFuncs[type](date);
    });
  }
  return resultStr;
}

/**
 * 判断是否是有效的Date对象
 *
 * @export
 * @param {*} date
 * @returns
 */
export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime())
}

export function getDict(key) {
  const dictionary = wx.getStorageSync('dictionary') ? JSON.parse(wx.getStorageSync('dictionary')) : []
  return dictionary[key] || [];
}

export function getDictObject(key, code) {
  return getDict(key).find((item) => {
    if (code && code === item.code) {
      return true;
    }
    return false;
  }) || {value: code};
}

export function getDictValue(key, code) {
  return getDictObject(key, code).value;
}

function defaultReplacer(key, value) {
  return {
    key: '_'+key,
    value,
  };
}

export function getBatchDictValue(data, dictModels, replacer = defaultReplacer) {
  let result = {};
  for (const model of dictModels) {
    let dictName;
    let dataName;
    if (typeof model === 'string') {
      dictName = dataName = model;
    } else {
      ([dictName, dataName] = model);
    }
    if (!replacer) {
      result[dataName] = getDictValue(dictName, data[dataName]);
    } else {
      let { key, value } = replacer(dataName, getDictValue(dictName, data[dataName]));
      result[key] = value;
    }
  }
  return result;
}