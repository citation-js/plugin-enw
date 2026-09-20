import type { CSL } from '@citation-js/core'

interface EnwEntry {
  scheme: 'enw'
  fields: Record<string, string|string[]>
}

declare module '@citation-js/core' {
  namespace plugins {
    namespace input {
      interface Formats {
        '@enw/file': (input: string) => Array<EnwEntry>
        '@enw/record': (input: EnwEntry) => CSL
      }
    }

    namespace output {
      interface Formats {
        enw:
          | ((options: { format: 'object', lineEnding?: string }) => Array<EnwEntry>)
          | ((options?: { format?: 'text', lineEnding?: string }) => string)
      }
    }
  }
}
