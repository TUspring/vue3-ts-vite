Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt.replace(/-/g, "/")))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

var util = {
  /**
   * 处理金额，两位小数
  */
  money: (value) => {
    return isNaN(value) ? '' : Math.round(value * 100) / 100
  },

  /**
   * 千位符处理
  */
  formatNumber(num) {
    if (isNaN(num)) {
      throw new TypeError("num is not a number");
    }
    return ("" + num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
  },

  /**
   * 日期处理
   * */ 
  timeFormat(time) {
    if (new Date().format('yyyy') === new Date(time).format('yyyy')) {
      return new Date(time).format('MM-dd');
    } else {
      return new Date(time).format('yyyy-MM-dd');
    }
  },

  /**
   * 对毫分金额处理
  */
  moneyFormat: (value) => { 
    return isNaN(value) ? '' : (Math.round(value) / 100).toFixed(2)
  },

  /**
   * 处理距离单位； 超1000米，显示公里
  */
  distanceFormat: (value) => {
    if (value < 1000) {
      return value + '米';
    } else {
      return (Math.round(value) / 1000).toFixed(1) + '公里';
    }
  },

  scoreFormat: (value) => {
    return isNaN(value) ? '' : (value / 100).toFixed(1)
  },

  dateFormat: (time) => {
    return new Date(time).format('MM月dd日')
  },

  weekFormat: (time) => {
    let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weekArr[new Date(time).getDay()]
  },

  /**
   * 文本标签处理
  */
  convertHtmlToText(inputText) {
    let returnText = "" + inputText;
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");
    return returnText;
  },

  /**
   * 处理头像名字
   * */ 
  substringName(name) {
    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    if (pattern.test(name)) {
      if (name.length > 3) return name.substr(2, 2);
      if (name.length > 2) return name.substr(1, 2);
      return name;
    }
    else {
      return name.substr(0, 1);
    }
  },

  /**
   * 数字转中文大写
   * */ 
  numberToString(n) {
    if (!n) return n;
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
      return "数据非法";  //判断数据是否大于0
    }
    var unit = "千百拾亿千百拾万千百拾元角分", str = "";
    n += "00";
    var indexpoint = n.indexOf('.');  // 如果是小数，截取小数点前面的位数
    if (indexpoint >= 0) {
      n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2);   // 若为小数，截取需要使用的unit单位
    }
    unit = unit.substr(unit.length - n.length);  // 若为整数，截取需要使用的unit单位
    for (var i = 0; i < n.length; i++) {
      str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);  //遍历转化为大写的数字
    }
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整"); // 替换掉数字里面的零字符，得到结果
  },
  
  /**
   * 数组去重
  */
  uniqueArray(arr) {
    var hash = {};
    arr = arr.reduce((item, next) => {
      hash[next.key] ? '' : hash[next.key] = true && item.push(next);
      return item;
    }, []);
    return arr;
  },

  isEmpty(obj) {
    if (obj == undefined || obj == null || new String(obj).trim() == '') {
      return true;
    } else {
      return false;
    }
  },

  setData(key, value) {
    var curTime = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({ data: JSON.stringify(value), time: curTime }));
  },

  getData(key, exp = 0) {
    var data = localStorage.getItem(key);
    if (this.isEmpty(data)) {
      return "";
    }
    var dataObj = JSON.parse(data);
    if ((exp > 0) && (new Date().getTime() - dataObj.time > (exp * 1000))) {
      return "";
    } else {
      var dataObjDatatoJson = JSON.parse(dataObj.data)
      return dataObjDatatoJson;
    }
  },

  removeData(key) {
    localStorage.removeItem(key)
  },

  interval(func, w, t) {
    var interv = () => {
      if (typeof t === "undefined" || t-- > 0) {
        setTimeout(interv, w);
        try {
          func.call(null);
        } catch (e) {
          t = 0;
          throw e.toString(); //返回十进制数
        }
      }
    };
    setTimeout(interv, w);
    return { clear() { t = 0 } };
  },

  //获取数据类型
  getType(obj) {
    var toString = Object.prototype.toString;
    var map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    };
    if (obj instanceof Element) {
      return 'element';
    }
    return map[toString.call(obj)];
  },

  //深克隆
  dataDeepClone(data) {
    var type = this.getType(data);
    var obj;
    if (type === 'array') {
      obj = [];
    } else if (type === 'object') {
      obj = {};
    } else {
      //不再具有下一层次
      return data;
    }
    if (type === 'array') {
      for (var i = 0, len = data.length; i < len; i++) {
        obj.push(this.dataClone(data[i]));
      }
    } else if (type === 'object') {
      for (var key in data) {
        obj[key] = this.dataClone(data[key]);
      }
    }
    return obj;
  },

  // 加密手机号码
  phoneSecurity(number) {
    var phone_number = "";
    for (var i = 0; i < number.length; i++) {
      if (i > 2 && i < 7) {
        phone_number = phone_number + "*";
      } else {
        phone_number = phone_number + number[i];
      }
    }

    return phone_number;
  },
  encryptionNumber(number) {
    var encryption = "";
    for (var i = 0; i < number.length; i++) {
      if (i > 2 && i < 7) {
        encryption = encryption + "*";
      } else {
        encryption = encryption + number[i];
      }
    }

    return encryption;
  },
  onlyNumber(code) {
    var reg = /^[0-9]*$/;
    if (!code.match(reg)) {
      code = code.replace(/[^\d.]/g, "");
    }
    return code;
  },
  //清楚空格
  clearSpace(str) {
    return str.replace(/\s+/g, "");
  },
  //倒计时
  countDown() {
    let codeDelay = 59;
    let timer = setInterval(() => {
      codeDelay -= 1;
      if (codeDelay === 0) {
        clearInterval(timer);
      }
      return codeDelay;
    }, 1000);
  },
  // 检验邮箱
  checkEmail(str) {
    var reEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    return !reEmail.test(str) ? false : true;
  },
  // 检验手机
  checkPhone(str) {
    var rePhone = /^1\d{10}$/;
    return !rePhone.test(str) ? false : true;
  },
  // 检验电话
  checkTel(str) {
    var reTel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    return !reTel.test(str) ? false : true;
  },

  // 教验传真
  checkFax(str) {
    var reFax = /^(\d{3,4}-)?\d{7,8}$/;
    return !reFax.test(str) ? false : true;
  },
}

export default util;