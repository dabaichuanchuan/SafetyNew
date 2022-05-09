import { QuestionType } from '@/utils/enum'

export const fieldMixin = {
  props: {
    field: {
      type: Object,
      default: () => {}
    },
    edit: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  computed: {
    questionType() {
      return QuestionType.getName(this.field.type)
    }
  },
  methods: {
    bindEndEdit() {
      this.$emit('end-edit')
    }
  }
}