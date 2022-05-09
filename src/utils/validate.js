import test from './test'

const getRule = function(name) {
  let message
  switch(name) {
    case 'fullname': message = '请输入正确的姓名！'; break
    case 'cnOrNum': message = '请输入汉字或数字！'; break
    case 'chinese': message = '请输入汉字！'; break
    case 'enOrNum': message = '请输入字母或数字！'; break
    case 'letter': message = '请输入字母！'; break
    case 'mobile': message = '请输入正确的手机号！'; break
    case 'landline': message = '请输入正确的固定电话！'; break
    case 'idCard': message = '请输入正确的身份证号！'; break
    case 'dateISO': message = '请输入正确的日期（格式：2000-12-31）！'; break
    case 'simpleTime': message = '请输入正确的时间（格式：23:59）！'; break
    case 'digits': message = '请输入整数！'; break
    case 'amount': message = '请输入小数！'; break
    case 'email': message = '请输入正确的电子邮件！'; break
    case 'url': message = '请输入正确的url地址！'; break
  }
  if(!message) return
  
  return {
    validator: function(rule, value, fun) {
      (test.empty2(value) || test[name](value)) ? fun() : fun(new Error(message))
    }
  }
}

export default {
  getRule: getRule
}