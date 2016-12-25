/* eslint-disable no-console */

import electron from 'electron'

const defaults = {
  path: './main.development.js',
  selector: 'default',
}

export const GRPC = 'GRPC/API'

export default (opts = {}) => {
  const options = { ...defaults, ...opts }
  const client = electron.remote.require(options.path)[options.selector]

  const call = client.sendPayment()

  call.on('data', (transaction) => {
    console.log('transaction', transaction)
  })

  // call.on('status', status => console.log('status', status.code, status))
  call.on('error', error => console.error('SendPayment Error', error))
  call.on('end', () => call.end())

  setTimeout(() => {
    call.write({
      amt: 4000,
      dest_string: 'sdg7624dgsd7g4sd765g4sfg',
      payment_hash: '765sdv8b764x8b7f35s8d',
    })
  }, 1000)

  return () => next => (action) => {
    const call = action && action[GRPC] // eslint-disable-line
    if (typeof call === 'undefined' || !call) { return next(action) }

    const { method, types = [], body, model, passthrough = {}, stream = false } = call
    const [REQUEST, SUCCESS, ERROR] = types

    REQUEST && next({ type: REQUEST })

    if (stream) { return client[method](body ? { body } : {}) }

    return new Promise((resolve, reject) => {
      const api = client[method](body || {}, (error, res) => {
        if (error) {
          ERROR && next({ type: ERROR, error })
          reject({ ...error, stream: api })
        } else {
          const data = { [model || method]: res }
          SUCCESS && next({ type: SUCCESS, ...data, ...passthrough })
          resolve({ ...data, stream: api, ...passthrough })
        }
      })
    })
  }
}