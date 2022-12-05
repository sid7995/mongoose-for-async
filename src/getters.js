const isPromise = require('is-promise')

module.exports = (getters) => function (document, next) {
  const promises = []

  for (const gettersKey in getters) {
    const getter = getters[gettersKey]

    const val = document[gettersKey]
    const schemaType = document.schema.paths[gettersKey]

    let result = getter.call(document, val, schemaType, document)

    if (isPromise(result)) {
      result = result.then((result) => applyGetter(document, gettersKey, result))
      promises.push(result)
    } else {
      applyGetter(document, gettersKey, result)
    }
  }

  Promise
    .all(promises)
    .then(() => next && next())
    .catch((err) =>next &&  next(err))
}

const applyGetter = (document, key, result) => {
  if (document[key] !== result) {
    const modified = document.isModified(key)
    document[key] = result
    if (!modified) document.unmarkModified(key)
  }
}
