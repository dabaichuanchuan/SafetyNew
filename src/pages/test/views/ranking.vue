<template>
  <el-col v-loading.fullscreen.lock="loading" :xs="{span:24,offset:0}" :sm="{span:16,offset:4}" :md="{span:12,offset:6}">
    <el-result v-if="notify.type" :icon="notify.type" :title="notify.title" :subTitle="notify.message">
    </el-result>
    <el-card v-else-if="test.title" class="ranking-bg">
      <div slot="header">
        <div class="test-header">
          <div class="title">{{test.title}}</div>
          <div class="describe">排行榜</div>
        </div>
      </div>
      <div class="list">
        <el-table
          :header-cell-style="{fontWeight:'normal'}"
          :data="list">
          <el-table-column label="排行" align="center" width="60">
            <template slot-scope="scope">
              <span class="num">
                <span v-if="scope.row.num">{{scope.row.num}}</span>
                <span v-else class="ukn">未上榜</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="left">
            <template slot-scope="scope">
              <span class="fullname">
                {{scope.row.display}}
                <el-tag v-if="scope.row.current" size="mini">当前</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="用时" align="center" width="80">
            <template slot-scope="scope">
              <span class="timeuse">{{scope.row.timeuse|formatSecond}}</span>
            </template>
          </el-table-column>
          <el-table-column label="得分" align="center" width="75">
            <template slot-scope="scope">
              <span class="total">{{scope.row.score}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </el-col>
</template>
<script>
import { getRankingList } from '../api/test'
import { formatDuring } from '@/utils/common' 

export default {
  name: 'rankingPage',
  mmetaInfo() {
    return {
      title: '考试排行',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' }
      ]
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      test: {},
      notify: {},
      tid: '',
      result: null,
    }
  },
  filters: {
    formatSecond(second) {
      return formatDuring(second * 1000)
    }
  },
  created () {
    let tid
    if(this.$route.params.tid) {
      tid = this.$route.params.tid
      this.result = this.$route.params.result
    } else {
      tid = this.$route.query.tid
    }
    if(tid) {
      this.tid = tid
      this.getList()
    } else {
       this.$message.error('缺少关键参数！')
    }
  },
  methods: {
    getList() {
      this.loading = true
      getRankingList(this.tid).then(res => {
        const { test, list, notify } = res.data
        //不显示排行通知
        if(notify) {
          this.notify = notify; return
        }
        //根据试卷重排
        if(this.result) {
          const index = list.findIndex(r => r.id == this.result.id)
          if(-1 < index) {
            this.result.num = list[index].num
            list.splice(index, 1)
          }
          this.result.current = true
          list.splice(0, 0, this.result)
        }
        //设置显示名称
        list.forEach(item => {
          item.display = item.fullname || item.group || item.number || item.other
          return item
        })
        this.list = list
        this.test = test
      }).catch(err => console.error(err)).then(() => this.loading = false)
    }
  } 
}
</script>
<style lang="scss">
  .ranking-bg {
    margin-bottom: 10px;
    .test-header {
      margin: 10px 0 0 0;
      .title {
        font-weight: bold;
        font-size: 20px;
        text-align: center;
        color: #409EFF;
      }
      .describe {
        font-size: 14px;
        padding: 15px 20px 0 15px;
        color: #606266;
      }
    }
    .list {
      .num {
        color: #909399;
        .ukn {
          font-size: 12px;
        }
      }
      .fullname {
        font-weight: bold;
        color: #303133;
      }
      .timeuse {
        color: #909399;
        font-size: 12px;
      }
      .total {
        font-size: 16px;
        font-weight: bold;
        color: #409EFF;
      }
    }
  }
</style>