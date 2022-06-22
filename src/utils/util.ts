


var util = {
  /**
   * 处理金额，两位小数
  */
  money: (value: any) => {
    return isNaN(value) ? '' : Math.round(value * 100) / 100
  },

  /**
   * 千位符处理
  */
  formatNumber(num: any) {
    if (isNaN(num)) {
      throw new TypeError("num is not a number");
    }
    return ("" + num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
  },
  /**
   * 日期格式化
   * 参数一：日期
   * 参数二：格式化
   * util.dateFormat(date, 'yyyy-MM-dd')
  */
  dateFormat(date:any,fmt: string): string {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt.replace(/-/g, "/")))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },


  /**
   * 对毫分金额处理
  */
  moneyFormat: (value: any) => {
    return isNaN(value) ? '' : (Math.round(value) / 100).toFixed(2)
  },

  /**
   * 处理距离单位； 超1000米，显示公里
  */
  distanceFormat: (value: number) => {
    if (value < 1000) {
      return value + '米';
    } else {
      return (Math.round(value) / 1000).toFixed(1) + '公里';
    }
  },

  scoreFormat: (value: number) => {
    return isNaN(value) ? '' : (value / 100).toFixed(1)
  },


  weekFormat: (time: string) => {
    let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weekArr[new Date(time).getDay()]
  },

  /**
   * 文本标签处理
  */
  convertHtmlToText(inputText: string) {
    let returnText = "" + inputText;
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");
    return returnText;
  },

  /**
   * 处理头像名字
   * */
  substringName(name: string) {
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
  numberToString(n: any) {
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
  uniqueArray(arr: any) {
    var hash: { [key: string]: any } = {};
    arr = arr.reduce((item: any, next: any) => {
      hash[next.key] ? '' : hash[next.key] = true && item.push(next);
      return item;
    }, []);
    return arr;
  },

  isEmpty(obj: any) {
    if (obj == undefined || obj == null || new String(obj).trim() == '') {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 手机号码中间几位显示星号
   * */
  encryptionNumber(value: string) {
    var encryption = "";
    for (var i = 0; i < value.length; i++) {
      if (i > 2 && i < 7) {
        encryption = encryption + "*";
      } else {
        encryption = encryption + value[i];
      }
    }
    return encryption;
  },

  onlyNumber(code: string) {
    var reg = /^[0-9]*$/;
    if (!code.match(reg)) {
      code = code.replace(/[^\d.]/g, "");
    }
    return code;
  },

  //清楚空格
  clearSpace(str: string) {
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
  checkEmail(str: string) {
    var reEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    return !reEmail.test(str) ? false : true;
  },
  // 检验手机
  checkPhone(str: string) {
    var rePhone = /^1\d{10}$/;
    return !rePhone.test(str) ? false : true;
  },
  // 检验电话
  checkTel(str: string) {
    var reTel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    return !reTel.test(str) ? false : true;
  },

  // 教验传真
  checkFax(str: string) {
    var reFax = /^(\d{3,4}-)?\d{7,8}$/;
    return !reFax.test(str) ? false : true;
  },
}
export default util;