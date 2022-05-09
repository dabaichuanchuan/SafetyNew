export const fieldMixin = {
  props: {
    field: {
      type: Object,
      default: () => {}
    },
    paper: {
      type: Boolean,
      default: false
    }
  }
}