import { translator } from './mapping'

function formatRecord ({ fields }, lineEnding) {
  let record = ''
  for (const field in fields) {
    const values = [].concat(fields[field])
    for (const value of values) {
      record += '%' + field + ' ' + value + lineEnding
    }
  }
  return record
}

export default {
  enw (csl, options = {}) {
    const { format = 'text', lineEnding = '\n' } = options
    const records = csl.map(record => ({ scheme: 'enw', fields: translator.convertToSource(record) }))

    if (format === 'object') {
      return records
    }

    return records.map(record => formatRecord(record, lineEnding)).join(lineEnding)
  }
}
