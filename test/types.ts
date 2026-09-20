import { Cite } from '@citation-js/core'
import '..'

const a = new Cite({})
const b = a.format('enw', { lineEnding: '\n' })

type Expect<T extends true> = T
type IsString<T> = T extends string ? true : false

// @ts-ignore
type Tests = [
  Expect<IsString<typeof b>>
]
