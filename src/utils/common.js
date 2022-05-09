export function formatShowPath(show_path) {
  return show_path ? show_path.replace(/^\/|\/$/gm,'') : ''
}

export function formatDateTime(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
    }
  }
  return fmt;
}

export const formatDuring = mss => {
  let str = ''
  let days = parseInt(mss / (1000 * 60 * 60 * 24))
  if (days) {
    str = days + "天"
  }
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (hours) {
    str += hours + "小时"
  }
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  if (minutes) {
    str += minutes + "分"
  }
  let seconds = parseInt((mss % (1000 * 60)) / 1000)
  if (seconds) {
    str += seconds + "秒"
  }
  return str
}

export function random(seed, max = 10) {
  seed = (seed * 9301 + 49297) % 233280
  seed = seed / 233280.0
  return Math.floor(seed * max)
}

export function shuffle(array, seed, start, end) {
  let length = end - start
    , index, temp
  while(length > 0) {
    index = start + random(seed++, length + 1)
    temp = array[start + length]
    array[start + length] = array[index]
    array[index] = temp
    length--
  }
  return array
}

export function timestamp(time = new Date()) {
  return parseInt(time.getTime() / 1000)
}