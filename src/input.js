import { translator } from './mapping'

function finalizeRecord (fields) {
  /* istanbul ignore else */
  if ('0' in fields) {
    fields[0] = fields[0].replace(
      /(^| )(.)/g,
      (_, prefix, letter) => prefix + letter.toUpperCase()
    )
  }
  return { scheme: 'enw', fields }
}

function parseFile (file) {
  const lines = file.trim()
    .replace(/^\$]/m, '%]')
    .replace(/^(%[([]) ?/m, '$1 ')
    .replace(/\n(?![%\n])/, ' ')
    .split('\n')

  const records = []
  let fields
  for (const line of lines) {
    if (!line.length) {
      continue
    }

    const field = line.slice(1, 2)

    if (field === '0') {
      if (fields) {
        records.push(finalizeRecord(fields))
      }
      fields = {}
    }

    const value = line.slice(3)
    if (Array.isArray(fields[field])) {
      fields[field].push(value)
    } else if (field in fields) {
      fields[field] = [fields[field], value]
    } else {
      fields[field] = value
    }
  }

  return records.concat(finalizeRecord(fields))
}

export default {
  '@enw/file': {
    parse (file) {
      return parseFile(file)
    },
    parseType: {
      dataType: 'String',
      predicate: /^%0/m
    }
  },

  '@enw/record': {
    parse (record) {
      return translator.convertToTarget(record.fields)
    },
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {
        props: 'scheme',
        value (scheme) { return scheme === 'enw' }
      }
    }
  }
}
