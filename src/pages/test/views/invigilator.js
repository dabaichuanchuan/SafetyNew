import Cookies from 'js-cookie'
import test from '@/utils/test'

const loadData = function(key, hash) {
  let data = Cookies.get(key)
  if(data) {
    if(test.jsonString(data)) {
      data = JSON.parse(data)
      if(hash != data.hash) {
        Cookies.remove(key)
        data = null
      }
    } else {
      Cookies.remove(key)
      data = null
    }
  }
  return data || { hash: hash }
}

const saveData = function(key, data) {
  Cookies.set(key, JSON.stringify(data) , { expires: 15 })
}

const Invigilator = function(tid, hash, max_timeuse, max_times) {
  const key = `tms_${tid}`
  this.enable = !!(max_timeuse || max_times)
  this.data = loadData(key, hash)

  this.start = () => {
    //考试次数限制
    const succc = !max_times || validTimes()
    if(succc && max_timeuse) {
      startTimer(max_timeuse)
    }
  }

  this.stop = (save) => {
    if(save && this.enable) {
      saveData(key, this.data)
    }
  }

  this.submited = (succ) => {
    if(max_times) {
      //累加次数
      incTimes()
    }
    if(max_timeuse) {
      //结束计时器
      cancelTimer()
    }
  }

  this.message = (msg) => {
    if(!this.onMessage) return
    this.onMessage(msg, this.data)
  }

  //计时器逻辑
  const timer = {
    day: '',
    hour: '00',
    min: '00',
    ss: '00',
    status: 'init',
    interval: 0
  }
  const startTimer = (second, danger = 15) => {
    if(second < 1) return;
    const min = 60;
    const hour = min * 60;
    const day = hour * 24;
    const prefixNum = (n) => {
      return n < 10 ? '0' + n : n;
    }
    const fn = (ss) => {
      if(ss < 1)  {
        doneTimer(false); return
      }
      if(ss <= danger && 'danger' != timer.status) {
        timer.status = 'danger'
      }
      timer.day = parseInt(ss / day, 10)
      timer.hour = prefixNum(parseInt(ss / hour, 10) % 24)
      timer.min = prefixNum(parseInt(ss / min, 10) % 60)
      timer.ss = prefixNum(ss % min)
      refreshTimer()
    }
    timer.status = 'run'
    fn(second)
    timer.interval = setInterval(() => fn(--second), 1000)
  }
  const cancelTimer = () => {
    doneTimer(true)
  }
  const doneTimer = (cancel) => {
    clearInterval(timer.interval)
    timer.status = 'done'
    this.message({ type: 'max_timeuse', cancel: cancel })
  }
  const refreshTimer = () => {
    if(!this.onRefreshTimer) return
    this.onRefreshTimer(timer)
  }

  //考试次数限制逻辑
  const validTimes = () => {
    if(max_times && this.data.times >= max_times) {
      this.message({ type: 'max_times', times: max_times })
      return false
    } else {
      return true
    }
  }
  const incTimes = () => {
    this.data.times = (this.data.times || 0) + 1
  }
}

export default Invigilator