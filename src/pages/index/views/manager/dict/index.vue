<template> 
  <div class="app-container">
     </div>
</template>
<script>
import { getDictTypeListForEnterprise } from '../../../api/dict'
import { formatDateTime } from '@/utils/common'

export default {
  name: 'defaultList',
  data() {
    return {
      list: [],
      listLoading: false,      
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  filters: {
    formatTime(time) {
      return time ? formatDateTime(new Date(time), 'yyyy-MM-dd hh:mm:ss') : ''
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getDictTypeListForEnterprise().then(res => {
        this.list = res.data
        this.listLoading = false
      })
    }
  }

}
</script>
