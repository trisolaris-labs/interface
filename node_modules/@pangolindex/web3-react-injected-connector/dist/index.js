
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./web3-react-injected-connector.cjs.production.min.js')
} else {
  module.exports = require('./web3-react-injected-connector.cjs.development.js')
}
