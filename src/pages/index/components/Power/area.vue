<template>
  <div v-if="show">
    <slot :data="user"></slot>
  </div>
</template>

<script>
import { UserRoles } from '@/utils/enum'
import { mapGetters } from 'vuex'

export default {
  name: 'powerArea',
  props: {
    in: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'principal',
    ]),
    show() {
      return this.principal.in(UserRoles.getFlags(this.in))
    }
  }
}
</script>

<style scoped>
</style>
