const isPromise = require('is-promise')

module.exports = (setters, options) => function (next) {
  const document = this
  const promises = []

  for (const settersKey in setters) {
    const setter = setters[settersKey]

    if (options.onApply === 'save' || document.isModified(settersKey)) {
      const val = document[settersKey]
      const schemaType = document.schema.paths[settersKey]

      // execute setter (this = doc)
      let result = setter.call(document, val, schemaType, document)

      if (isPromise(result)) {
        // async setter
        result = result.then((result) => applySetter(document, settersKey, result))

        // collect promises for tracking
        promises.push(result)
      } else {
        // sync setter
        applySetter(document, settersKey, result)
      }
    }
  }

  Promise
    .all(promises)
    // wait till all promises are complete
    .then(() => next && next())
    // centralized error handling
    .catch((err) => next && next(err))
}

const applySetter = (document, key, result) => {
  if (document[key] !== result) document[key] = result
}
