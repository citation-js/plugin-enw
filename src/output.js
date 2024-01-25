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

function translateRecord (record) {
  const fields = translator.convertToSource(record)

  for (const field in fields) {
    if (Array.isArray(fields[field]) && fields[field].length === 1) {
      fields[field] = fields[field][0]
    }
  }

  return { scheme: 'enw', fields }
}

export default {
  enw (csl, options = {}) {
    const { format = 'text', lineEnding = '\n' } = options
    const records = csl.map(translateRecord)

    if (format === 'object') {
      return records
    }

    return records.map(record => formatRecord(record, lineEnding)).join(lineEnding)
  }
}
