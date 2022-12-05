const applyGetters = require('./getters.js')
const applySetters = require('./setters.js')

const defaults = {
  getters: {},
  setters: {
    onApply: 'save',
  }
}

module.exports = exports = function plugin (schema, options) {
  // merge defaults with options
  options = options ? {
    ...defaults,
    ...options,
    getters: {
      ...defaults.getters,
      ...options.getters,
    },
    setters: {
      ...defaults.setters,
      ...options.setters,
    },
  } : defaults

  const getterObject = {}
  const settersObject = {}

  for (const id in schema.obj) {
    const value = schema.obj[id]

    // path is getter
    if (value.getter instanceof Function) getterObject[id] = value.getter

    // path is setter
    if (value.setter instanceof Function) settersObject[id] = value.setter
  }

  // apply getters
  schema.post('init', applyGetters(getterObject, options.getters))
  schema.post('save', applyGetters(getterObject, options.getters))

  // apply setters
  schema.pre('save', applySetters(settersObject, options.setters))
}
