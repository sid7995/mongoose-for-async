# Mongoose Async
> Mongoose plugin which accepts async promises

## Summary 
Most of the hooks are asynchronous in mongoose and only mongoose does not provide this capability .

This is plugin built on top of mongoose in which async functions are evaluated and values are assigned to given schema key.
## Installation
```bash
npm install mongoose-for-async
```

or

```bash
yarn add mongoose-for-async
```

## How to Use
```javascript
const mongoose = require('mongoose')
const mongooseAsyncPlugin = require('mongoose-for-async')

const schema = new mongoose.Schema({...})

schema.plugin(mongooseAsyncPlugin, options)
```

Alternatively (add to every schema):

```javascript
const mongoose = require('mongoose')
const mongooseAsyncPlugin = require('mongoose-for-async')

mongoose.plugin(mongooseAsyncPlugin, options)
```


### Getter and Setter

```javascript
const schema = new mongoose.Schema({
  somePath: {
    type: String,
    // ...
    getter: async (value, schemaType, document) => {
      // this === document (like mongoose getter)
      // do something async
      return 'value which is generated through code'
    },
    setter: async (value, schemaType, document) => {
      return 'value which is stored in database'
    }
  }
})
```

### Options
This plugin currently has only one option: `setters.applyOn`.

Below is the defaults object for reference:

```javascript
const defaults = {
  getters: {},
  setters: {
    onApply: 'save',
  }
}
```

## How it works
- `getters.js` is executed when value is fetched from DB.
- `setters.js` is executed before value is saved in DB.

Note - Synchronous functions works too here

