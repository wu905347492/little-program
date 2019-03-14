const FIELD = '../field/index'

Component({
  relations: {
    [FIELD]: {
      type: 'child'
    }
  },
  data: {},
  methods: {
    validateEventer(rules, options, cb) {
      let fieldList = this.getRelationNodes(FIELD)
      let valid = true

      fieldList.forEach(item => {
        const { prop } = item.data
        const value = options[prop]
        const rule = rules[prop]

        if (rule.require) {
          // 判断是否有值
          let isExit = true
          if (rule.type == 'string' || rule.type == 'boolean') {
            isExit = !!value
          }
          if (rule.type == 'array') {
            isExit = value.length > 0
          }

          if (!isExit) {
            item.showErr(rule.message)
            valid = false
          }
          if (isExit) {
            if (rule.validator && !rule.validator(value)) {
              item.showErr(rule.typeMessage)
              valid = false
            }
          }
        }
      })

      cb(valid)
    }
  }
})
