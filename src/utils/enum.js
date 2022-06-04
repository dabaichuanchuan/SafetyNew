const EnumFlags = function() {
  const array = []
  array.items = (fn) => {
    return array.map(val => {
      let item = { name: val.name, flag: val.flag }
      if(fn) item.disabled = !fn(item)
      return item
    })
  }
  array.getNames = (flags, def = '') => {
    const result = array.reduce((total, val) => {
      if(flags & val.flag) {
				total += val.name + '、'
			}
      return total
    }, '')
		return result ? result.replace(/\、$/gi, '') : def
  }
  array.getFlags = (keys) => {
    return Object.keys(array).filter(key => keys.includes(key)).reduce((total, key) => total |= array[key].flag, 0) || 0
  }
  return array
}

const EnumType = function() {
  const array = []
  array.items = (fn) => {
    return array.map(val => {
      let item = { name: val.name, value: val.value }
      if(fn) item.disabled = !fn(item)
      return item
    })
  }
  array.getName = (val, def = '') => {
    const item = array.find(e => e.value == val)
    return item ? item.name : def
  }
  array.getValue = (name, def = 0) => {
    const item = array.find(e => e.name == name)
    return item ? item.value : def
  }
  return array
}

export function flagsToItems(flags) {
  return flags.toString(2).split('').reverse().map((val, i) => val * Math.pow(2, i)).filter(val => !!val)
}

export function itemsToFlags(items, def = 0) {
  return items && items.length ? items.reduce((total, val) => total |= val, 0) : def
}

//////////////////////////////////////////////////////////////////////////////////////////


export const CommonFlagEnum = (function(Enum){
  Enum[0] = Enum['Normal'] = { name: '是', value: 0 };
  Enum[1] = Enum['Deleted'] = { name: '否', value: 1 };
  return Enum;
})(EnumType())


export const MenuTypeEnum = (function(Enum){
  Enum[0] = Enum['Manager'] = { name: '系统管理', value: 1 };
	return Enum;
})(EnumType())

export const OrgTypeEnum = (function(Enum){
  Enum[0] = Enum['Group'] = { name: '集团', value: 1 };
  Enum[1] = Enum['System'] = { name: '系统', value: 2 };
  Enum[2] = Enum['Area'] = { name: '区域', value: 3 };
  Enum[3] = Enum['Single'] = { name: '单店', value: 4 };
  Enum[4] = Enum['Other'] = { name: '其他', value: 5 };
	return Enum;
})(EnumType())

export const IsOrgEnum = (function(Enum){
  Enum[0] = Enum['BM'] = { name: '部门', value: 1 };
  Enum[1] = Enum['JG'] = { name: '机构', value: 2 };
  Enum[2] = Enum['DW'] = { name: '单位', value: 3 };
   return Enum;
  })(EnumType())

  export const TemplateGradeEnum = (function(Enum){
    Enum[0] = Enum['General'] = { name: '一般事项', value: 1 };
    Enum[1] = Enum['Important'] = { name: '重要事项', value: 2 };
    return Enum;
  })(EnumType())
  
//模板运营状态
export const TemplateOperationStateEnum = (function (Enum) {
  Enum[0] = Enum['PreparationPeriod'] = { name: '筹建期', value: 1 };
  Enum[1] = Enum['OperationPeriod'] = { name: '运营期', value: 2 };
  return Enum;
})(EnumType())

//模板类型
export const TemplateTypeEnum = (function (Enum) {
  Enum[0] = Enum['NPNODE'] = { name: '安全计划', value: 1 };
  Enum[1] = Enum['KCNODE'] = { name: '厨房计划', value: 2 };
  return Enum;
})(EnumType())
//模板生成频次
export const TemplateFrequencyEnum = (function (Enum) {
    Enum[0] = Enum['Week'] = { name: '周', value: 1 };
    Enum[1] = Enum['HalfMonth'] = { name: '半月', value: 2 };
    Enum[2] = Enum['Month'] = { name: '月', value: 3 };
    Enum[3] = Enum['DoubleMonth'] = { name: '双月', value: 4 };
    Enum[4] = Enum['Quarter'] = { name: '季度', value: 5 };
    Enum[5] = Enum['HalfYear'] = { name: '半年', value: 6 };
    Enum[6] = Enum['Year'] = { name: '年', value: 7 };
    Enum[7] = Enum['Special'] = { name: '专项', value: 8 };
    Enum[8] = Enum['Other'] = { name: '其他', value: 9 };
    return Enum;
  })(EnumType())

//模板字段类型
export const TemplateClassTypeEnum = (function (Enum) {
    Enum[0] = Enum['input'] = { name: '文本框', value: 1 };
    Enum[1] = Enum['text'] = { name: '文本域', value: 2 };
    Enum[2] = Enum['radio'] = { name: '单选按钮', value: 3 };
    Enum[3] = Enum['select'] = { name: '下拉选择', value: 4 };
    Enum[4] = Enum['datePicker'] = { name: '日期选择', value: 5 };
    Enum[5] = Enum['upload'] = { name: '附件', value: 6 };
    Enum[6] = Enum['showLable'] = { name: '说明类型', value: 7 };
    Enum[7] = Enum['approvalCommon'] = { name: '同时审批人', value: 8 };
    Enum[8] = Enum['approvalOrder'] = { name: '顺序审批人', value: 9 };
    Enum[9] = Enum['cCPerson'] = { name: '抄送人', value: 10 };
    return Enum;
  })(EnumType())

///////////////////////////////////////////////////////////////////////////////////////////


export const TestStatus = (function(Enum){
  Enum[0] = Enum['Waiting'] = { name: '待发布', value: 0 };
  Enum[1] = Enum['Published'] = { name: '已发布', value: 1 };
  Enum[2] = Enum['Paused'] = { name: '已暂停', value: 2 };
  Enum[3] = Enum['Deleted'] = { name: '已删除', value: 3 };
  return Enum;
})(EnumType())

export const TestResultStatus = (function(Enum){
  Enum[0] = Enum['Testing'] = { name: '考试中', value: 0 };
  Enum[1] = Enum['Submitted'] = { name: '已提交', value: 1 };
  Enum[2] = Enum['Timeout'] = { name: '超时提交', value: 2 };
  Enum[3] = Enum['Cheat'] = { name: '超时提交', value: 3 };
  return Enum;
})(EnumType())

export const QuestionType = (function(Enum){
  Enum[0] = Enum['single'] = { name: '填空题', value: 'single' };
  Enum[1] = Enum['radio'] = { name: '单选题', value: 'radio' };
  Enum[2] = Enum['judge'] = { name: '判断题', value: 'judge' };
  Enum[3] = Enum['checkbox'] = { name: '多选题', value: 'checkbox' };
  return Enum;
})(EnumType())

export const BusStatus = (function(Enum){
  Enum[0] = Enum['Normal'] = { name: '正常', value: 0 };
  Enum[1] = Enum['Locked'] = { name: '锁定', value: 1 };
  Enum[2] = Enum['Deleted'] = { name: '删除', value: 2 };
  return Enum;
})(EnumType())

export const UserStatus = (function(Enum){
  Enum[0] = Enum['Normal'] = { name: '正常', value: 0 };
  Enum[1] = Enum['Locked'] = { name: '锁定', value: 1 };
  Enum[2] = Enum['Deleted'] = { name: '删除', value: 2 };
  return Enum;
})(EnumType())

export const UserRoles = (function(Enum){
  Enum[0] = Enum['Test'] = { name: '考试编制', flag: 1 };
  Enum[1] = Enum['Result'] = { name: '成绩查询', flag: 2 };
  Enum[2] = Enum['Manager'] = { name: '用户管理', flag: 4 };
	return Enum;
})(EnumFlags())

export const LimitType = (function(Enum){
  Enum[0] = Enum['Browser'] = { name: '浏览器', value: 0 };
  Enum[1] = Enum['App'] = { name: '嵌入App', value: 1 };
  return Enum;
})(EnumType())
