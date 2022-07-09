import { util } from '@citation-js/core'
import { parse as parseDate, format as formatDate } from '@citation-js/date'
import { parse as parseName, format as formatName } from '@citation-js/name'

const TYPES = {
  toTarget: {
    'Aggregated Database': 'dataset',
    'Ancient Text': 'classic',
    Artwork: 'graphic',
    'Audiovisual Material': 'motion_picture',
    Bill: 'bill',
    Blog: 'post-weblog',
    Book: 'book',
    'Book Section': 'chapter',
    Case: 'legal_case',
    'Chart or Table': 'figure',
    'Classical Work': 'classic',
    'Computer Program': 'software',
    'Conference Paper': 'paper-conference',
    'Conference Proceedings': 'book',
    Dataset: 'dataset',
    Dictionary: 'entry-dictionary',
    'Edited Book': 'book',
    'Electronic Article': 'article-journal',
    'Electronic Book': 'book',
    'Electronic Chapter': 'chapter',
    Encyclopedia: 'entry-encyclopedia',
    Equation: 'figure',
    Figure: 'figure',
    'Film or Broadcast': 'motion_picture',
    Generic: 'document',
    'Government Document': 'document',
    Grant: 'document',
    Hearing: 'hearing',
    'Journal Article': 'article-journal',
    'Legal Rule or Regulation': 'regulation',
    'Magazine Article': 'article-magazine',
    Manuscript: 'manuscript',
    Map: 'map',
    Music: 'song',
    'Newspaper Article': 'article-newspaper',
    'Online Database': 'dataset',
    'Online Multimedia': 'motion_picture',
    Pamphlet: 'pamphlet',
    Patent: 'patent',
    'Personal Communication': 'personal_communication',
    Report: 'report',
    Serial: 'periodical',
    Standard: 'standard',
    Statute: 'legisliation',
    Thesis: 'thesis',
    'Unpublished Work': 'article',
    'Web Page': 'webpage'
  },
  toSource: {
    article: 'Unpublished Work',
    'article-journal': 'Journal Article',
    'article-magazine': 'Magazine Article',
    'article-newspaper': 'Newspaper Article',
    bill: 'Bill',
    book: 'Book',
    broadcast: 'Film or Broadcast',
    chapter: 'Book Section',
    classic: 'Classical Work',
    dataset: 'Dataset',
    document: 'Generic',
    entry: 'Catalog',
    'entry-dictionary': 'Dictionary',
    'entry-encyclopedia': 'Encyclopedia',
    figure: 'Figure',
    graphic: 'Artwork',
    hearing: 'Hearing',
    legal_case: 'Case',
    legislation: 'Statute',
    manuscript: 'Manuscript',
    map: 'Map',
    motion_picture: 'Film or Broadcast',
    musical_score: 'Music',
    pamphlet: 'Pamphlet',
    'paper-conference': 'Conference Paper',
    patent: 'Patent',
    periodical: 'Serial',
    personal_communication: 'Personal Communication',
    post: 'Blog',
    'post-weblog': 'Blog',
    regulation: 'Legal Rule or Regulation',
    report: 'Report',
    software: 'Computer Program',
    song: 'Music',
    standard: 'Standard',
    thesis: 'Thesis',
    webpage: 'Web Page'
  }
}

const CONVERTERS = {
  TYPE: {
    toTarget (type) {
      return TYPES.toTarget[type] || /* istanbul ignore next */ 'document'
    },
    toSource (type) {
      return TYPES.toSource[type] || /* istanbul ignore next */ 'Generic'
    }
  },
  DATE: {
    toTarget (date, year) {
      return date ? parseDate(date) : CONVERTERS.YEAR.toTarget(year)
    },
    toSource (date) {
      return [formatDate(date), CONVERTERS.YEAR.toSource(date)]
    }
  },
  YEAR: {
    toTarget (year) {
      return { 'date-parts': [[+year]] }
    },
    toSource (date) {
      const year = date && date['date-parts'] && date['date-parts'][0] && date['date-parts'][0][0]
      return year && year.toString()
    }
  },
  NAMES: {
    toTarget (names) {
      return names.map(parseName)
    },
    toSource (names) {
      return names.map(name => formatName(name, true))
    }
  },
  ISBN_ISSN: {
    toTarget (number) {
      return number.toString().match(/^\d{4}-\d{3}[0-9xX]$/)
        ? [undefined, number]
        : [number, undefined]
    },
    toSource (isbn, issn) {
      return isbn || issn
    }
  },
  GENRE_DEGREE: {
    toTarget (genre, degree) {
      return degree || genre
    },
    toSource (genre) {
      return genre.match(/master|phd|doctoral/i) ? [undefined, genre] : [genre, undefined]
    }
  }
}

const MAPPINGS = [
  {
    source: '!',
    target: 'title-short',
    when: {
      source: {
        '0': [
          'Ancient Text',
          'Aggregated Database',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Classical Work',
          'Computer Program',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Chapter',
          'Encyclopedia',
          'Film or Broadcast',
          'Generic',
          'Grant',
          'Hearing',
          'Journal Article',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'report',
          'software',
          'song',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'O',
    target: 'title-short',
    when: {
      source: {
        '!': false,
        0: [
          'Ancient Text',
          'Book',
          'Book Section',
          'Catalog',
          'Dataset',
          'Dictionary',
          'Encyclopedia',
          'Pamphlet',
          'Personal Communication',
          'Serial',
          'Standard',
          'Statute',
          'Unpublished Work'
        ]
      },
      target: {
        type: 'standard'
      }
    }
  },
  {
    source: '#',
    target: 'medium',
    when: {
      source: { 0: ['Audiovisual Material', 'Online Multimedia'] },
      target: false
    }
  },
  {
    source: '#',
    target: 'number',
    when: { source: { 0: ['Grant'] }, target: false }
  },
  {
    source: '#',
    target: 'volume-title',
    when: { source: { 0: ['Electronic Article'] }, target: false }
  },
  {
    source: '#',
    target: 'publisher',
    when: {
      source: { 0: ['Statute'] },
      target: { type: ['legislation'] }
    }
  },
  {
    source: '#',
    target: 'references',
    when: { source: { 0: ['Patent'] }, target: { type: ['patent'] } }
  },
  {
    source: '9',
    target: 'medium',
    when: {
      source: { 0: ['Film or Broadcast'] },
      target: { type: ['broadcast', 'motion_picture'] }
    }
  },
  {
    source: ['#', 'D'],
    target: 'issued',
    when: { source: { 0: ['Electronic Book'] }, target: false },
    convert: CONVERTERS.DATE
  },
  {
    source: '$',
    target: 'issue',
    when: { source: { 0: ['Report'] }, target: { type: ['report'] } }
  },
  {
    source: '$',
    target: 'status',
    when: { source: { 0: ['Patent'] }, target: { type: ['patent'] } }
  },
  {
    source: '$',
    target: 'volume',
    when: {
      source: { 0: ['Statute'] },
      target: { type: ['legislation'] }
    }
  },
  {
    source: '&',
    target: 'available-date',
    when: { source: { 0: ['Electronic Article'] }, target: false },
    convert: CONVERTERS.DATE
  },
  {
    source: '&',
    target: 'submitted',
    when: { source: { 0: ['Case'] }, target: { type: ['legal_case'] } },
    convert: CONVERTERS.DATE
  },
  {
    source: '&',
    target: 'page',
    when: { source: { 0: ['Book'] }, target: { type: ['book'] } }
  },
  {
    source: '&',
    target: 'section',
    when: {
      source: {
        0: [
          'Generic',
          'Government Document',
          'Legal Rule or Regulation',
          'Music',
          'Newspaper Article',
          'Standard',
          'Statute'
        ]
      },
      target: {
        type: [
          'article-newspaper',
          'document',
          'legislation',
          'musical_score',
          'regulation',
          'song',
          'standard'
        ]
      }
    }
  },
  {
    source: '&',
    target: 'page-first',
    when: {
      source: { 0: ['Journal Article', 'Magazine Article', 'Manuscript'] },
      target: { type: ['article-journal', 'article-magazine', 'manuscript'] }
    }
  },
  {
    source: '&',
    target: 'version',
    when: {
      source: { 0: ['Dictionary'] },
      target: { type: ['entry-dictionary'] }
    }
  },
  {
    source: '(',
    target: 'edition',
    when: { source: { 0: ['Electronic Book'], 7: false }, target: false }
  },
  {
    source: '*',
    target: 'reviewed-title',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Book Section',
          'Dictionary',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Generic',
          'Grant',
          'Journal Article',
          'Magazine Article',
          'Newspaper Article',
          'Serial'
        ]
      },
      target: {
        type: [
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'chapter',
          'document',
          'entry-dictionary',
          'entry-encyclopedia',
          'periodical'
        ]
      }
    }
  },
  {
    source: '0',
    target: 'type',
    convert: CONVERTERS.TYPE
  },
  {
    source: '1',
    target: 'publisher-place',
    when: {
      source: { 0: ['Conference Paper', 'Conference Proceedings'] },
      target: { type: ['paper-conference'] }
    }
  },
  {
    source: '1',
    target: 'scale',
    when: { source: { 0: ['Map'] }, target: { type: ['map'] } }
  },
  {
    source: '2',
    target: 'issue',
    when: {
      source: { 0: ['Newspaper Article'] },
      target: { type: ['article-newspaper'] }
    }
  },
  {
    source: '2',
    target: 'PMCID',
    when: {
      source: { 0: ['Journal Article'] },
      target: { type: ['article-journal'] }
    }
  },
  {
    source: '2',
    target: 'number',
    when: {
      source: { 0: ['Serial'] },
      target: { type: ['periodical'] }
    }
  },
  {
    source: ['8', '2'],
    target: 'issued',
    when: { source: { 0: ['Conference Proceedings'] }, target: false },
    convert: CONVERTERS.DATE
  },
  {
    source: ['8', 'D'],
    target: 'issued',
    when: { source: { 0: ['Patent'] }, target: { type: ['patent'] } },
    convert: CONVERTERS.DATE
  },
  {
    source: ['2', 'D'],
    target: 'issued',
    when: { source: { 0: ['Patent'], 8: false }, target: false },
    convert: CONVERTERS.DATE
  },
  {
    source: '3',
    target: 'genre',
    when: { source: { 0: ['Dataset'] }, target: { type: ['dataset'] } }
  },
  {
    source: '3',
    target: 'PMCID',
    when: { source: { 0: ['Electronic Article'] }, target: false }
  },
  {
    source: '3',
    target: 'container-title',
    when: { source: { 0: ['Conference Proceedings'] }, target: false }
  },
  {
    source: '3',
    target: 'dimensions',
    when: {
      source: { 0: ['Artwork', 'Audiovisual Material', 'Map'] },
      target: { type: ['graphic', 'map'] }
    }
  },
  {
    source: 'A',
    target: 'author',
    when: {
      source: {
        0: [
          'Book',
          'Book Section',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter'
        ],
        4: false
      },
      target: {
        type: ['book', 'chapter'],
        'reviewed-author': false
      }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'A',
    target: 'reviewed-author',
    when: {
      source: {
        0: [
          'Book',
          'Book Section',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter'
        ],
        4: true
      },
      target: {
        type: ['book', 'chapter']
      }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: '4',
    target: 'author',
    when: {
      source: {
        0: [
          'Book',
          'Book Section',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter'
        ]
      },
      target: {
        type: ['book', 'chapter'],
        'reviewed-author': true
      }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: '6',
    target: 'number',
    when: {
      source: {
        0: [
          'Catalog',
          'Dataset',
          'Manuscript',
          'Personal Communication'
        ]
      },
      target: {
        type: ['dataset', 'entry', 'manuscript', 'personal_communication']
      }
    }
  },
  {
    source: '6',
    target: 'number-of-volumes',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Book',
          'Book Section',
          'Classical Work',
          'Conference Proceedings',
          'Dictionary',
          'Edited Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Generic',
          'Hearing',
          'Music',
          'Serial'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'classic',
          'document',
          'entry-dictionary',
          'entry-encyclopedia',
          'hearing',
          'musical_score',
          'periodical',
          'song'
        ]
      }
    }
  },
  {
    source: '6',
    target: 'container-title-short',
    when: { source: { 0: ['Case'] }, target: { type: ['legal_case'] } }
  },
  {
    source: '6',
    target: 'collection-number',
    when: { source: { 0: ['Report'] }, target: { type: ['report'] } }
  },
  {
    source: '6',
    target: 'version',
    when: { source: { 0: ['Electronic Book'] }, target: false }
  },
  {
    // @: Document Number
    // 6: Session Number
    // S: Paper Number
    // V: Rule Number
    source: '@', // ['6', 'S', 'V'],
    target: 'number',
    when: {
      source: { 0: ['Standard'] },
      target: { type: ['standard'] }
    }
  },
  {
    // 6: Statute Number
    // N: Public Law Number
    source: '6', // ['N'],
    target: 'number',
    when: {
      source: { 0: ['Statute'] },
      target: { type: ['legislation'] }
    }
  },
  {
    // V: Rule Number
    // 6: Session Number
    source: 'V', // ['6'],
    target: 'number',
    when: {
      source: { 0: ['Legal Rule or Regulation'] },
      target: { type: ['regulation'] }
    }
  },
  {
    // ]: Article Number
    // 6: Document Number
    source: ']', // ['6'],
    target: 'number',
    when: { source: { 0: ['Electronic Article'] }, target: false }
  },
  {
    source: '7',
    target: 'edition',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Blog',
          'Book',
          'Book Section',
          'Catalog',
          'Classical Work',
          'Conference Proceedings',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Map',
          'Music',
          'Newspaper Article',
          'Pamphlet',
          'Report',
          'Serial',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article-magazine', 'article-newspaper',
          'book', 'broadcast',
          'chapter', 'classic',
          'document', 'entry',
          'entry-dictionary', 'entry-encyclopedia',
          'graphic', 'map',
          'motion_picture', 'musical_score',
          'pamphlet', 'periodical',
          'post', 'post-weblog',
          'regulation', 'report',
          'song', 'webpage'
        ]
      }
    }
  },
  {
    source: '7',
    target: 'available-date',
    when: {
      source: { 0: ['Journal Article'] },
      target: { type: ['article-journal'] }
    },
    convert: CONVERTERS.DATE
  },
  {
    source: '7',
    target: 'version',
    when: {
      source: {
        0: [
          'Chart or Table',
          'Computer Program',
          'Dataset',
          'Equation',
          'Figure'
        ]
      },
      target: { type: ['dataset', 'figure', 'software'] }
    }
  },
  {
    source: ['7', 'D'],
    target: 'issued',
    when: {
      source: { 0: ['Aggregated Database', 'Online Database'] },
      target: false
    },
    convert: CONVERTERS.DATE
  },
  {
    source: '8',
    target: 'accessed',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Case',
          'Electronic Article',
          'Electronic Book',
          'Online Database',
          'Online Multimedia'
        ]
      },
      target: { type: ['legal_case'] }
    }
  },
  {
    source: ['8', 'D'],
    target: 'issued',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Book',
          'Catalog',
          'Chart or Table',
          'Conference Paper',
          'Edited Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Pamphlet',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'document',
          'entry',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'periodical',
          'personal_communication',
          'regulation',
          'report',
          'song',
          'standard',
          'thesis'
        ]
      }
    },
    convert: CONVERTERS.DATE
  },
  {
    source: '9',
    target: 'medium',
    when: {
      source: { 0: ['Music'] },
      target: { type: ['musical_score', 'song'] }
    }
  },
  {
    source: '9',
    target: 'genre',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Blog',
          'Book',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Equation',
          'Figure',
          'Generic',
          'Grant',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'book',
          'classic',
          'document',
          'entry',
          'entry-dictionary',
          'figure',
          'graphic',
          'manuscript',
          'map',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'standard',
          'webpage'
        ]
      }
    }
  },
  {
    source: ['9', 'V'],
    target: 'genre',
    when: { source: { 0: ['Thesis'] }, target: { type: ['thesis'] } },
    convert: CONVERTERS.GENRE_DEGREE
  },
  {
    source: '?',
    target: 'performer',
    when: {
      source: { 0: ['Audiovisual Material', 'Film or Broadcast'] },
      target: { type: ['broadcast', 'motion_picture'] }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: '?',
    target: 'producer',
    when: {
      source: { 0: ['Music'] },
      target: { type: ['musical_score', 'song'] }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: '?',
    target: 'translator',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Book',
          'Book Section',
          'Catalog',
          'Classical Work',
          'Dictionary',
          'Edited Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Grant',
          'Pamphlet'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'classic',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'pamphlet'
        ]
      }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: '@',
    target: 'ISBN',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Audiovisual Material',
          'Blog',
          'Book',
          'Book Section',
          'Catalog',
          'Computer Program',
          'Conference Proceedings',
          'Dictionary',
          'Edited Book',
          'Electronic Book',
          'Encyclopedia',
          'Hearing',
          'Music',
          'Pamphlet',
          'Serial',
          'Web Page'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'hearing',
          'musical_score',
          'pamphlet',
          'periodical',
          'post',
          'post-weblog',
          'software',
          'song',
          'webpage'
        ]
      }
    }
  },
  {
    source: '@',
    target: 'ISSN',
    when: {
      source: {
        0: [
          'Dataset',
          'Electronic Article',
          'Journal Article',
          'Magazine Article',
          'Newspaper Article'
        ]
      },
      target: {
        type: [
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'dataset'
        ]
      }
    }
  },
  {
    source: '@',
    target: ['ISBN', 'ISSN'],
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Classical Work',
          'Electronic Chapter',
          'Generic',
          'Government Document',
          'Legal Rule or Regulation',
          'Map'
        ]
      },
      target: { type: ['classic', 'document', 'map', 'regulation'] }
    },
    convert: CONVERTERS.ISBN_ISSN
  },
  {
    source: '@',
    target: 'number',
    when: {
      source: { 0: ['Online Database', 'Patent'] },
      target: { type: ['patent'] }
    }
  },
  {
    // @: Report Number
    // N: Document Number
    source: '@', // ['N'],
    target: 'number',
    when: { source: { 0: ['Report'] }, target: { type: ['report'] } }
  },
  {
    source: 'A',
    target: 'author',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Blog',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Generic',
          'Government Document',
          'Grant',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'manuscript',
          'map',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'A',
    target: 'composer',
    when: {
      source: { 0: ['Music'] },
      target: { type: ['musical_score', 'song'] }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'A',
    target: 'editor',
    when: { source: { 0: ['Edited Book'] }, target: false },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'A',
    target: 'director',
    when: {
      source: { 0: ['Film or Broadcast'] },
      target: { type: ['broadcast', 'motion_picture'] }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'E',
    target: 'director',
    when: {
      source: { 0: ['Film or Broadcast'], A: false },
      target: false
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'B',
    target: 'container-title',
    when: {
      source: {
        0: [
          'Aggregated Database', 'Ancient Text',
          'Bill', 'Blog',
          'Book Section', 'Case',
          'Dictionary', 'Electronic Article',
          'Electronic Chapter', 'Encyclopedia',
          'Magazine Article', 'Manuscript',
          'Music', 'Newspaper Article',
          'Online Database', 'Statute'
        ]
      },
      target: {
        type: [
          'article-magazine',
          'article-newspaper',
          'bill',
          'chapter',
          'entry-dictionary',
          'entry-encyclopedia',
          'legal_case',
          'legislation',
          'manuscript',
          'musical_score',
          'post',
          'post-weblog',
          'song'
        ]
      }
    }
  },
  {
    source: 'B',
    target: 'committee',
    when: { source: { 0: ['Hearing'] }, target: { type: ['hearing'] } },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'B',
    target: 'event-title',
    when: {
      source: { 0: ['Conference Paper', 'Conference Proceedings'] },
      target: { type: ['paper-conference'] }
    }
  },
  {
    source: 'B',
    target: 'collection-title',
    when: {
      source: {
        0: [
          'Audiovisual Material',
          'Book',
          'Catalog',
          'Classical Work',
          'Computer Program',
          'Edited Book',
          'Film or Broadcast',
          'Map',
          'Online Multimedia',
          'Report',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'book',
          'broadcast',
          'classic',
          'entry',
          'map',
          'motion_picture',
          'report',
          'software',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'C',
    target: 'event-place',
    when: {
      source: { 0: ['Conference Paper', 'Conference Proceedings'] },
      target: { type: ['paper-conference'] }
    }
  },
  {
    source: 'C',
    target: 'publisher-place',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Blog',
          'Book',
          'Book Section',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Hearing',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Pamphlet',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-magazine',
          'article-newspaper',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'D',
    target: 'issued',
    when: {
      source: {
        0: [
          'Blog',
          'Book Section',
          'Classical Work',
          'Computer Program',
          'Dataset',
          'Dictionary',
          'Electronic Article',
          'Government Document',
          'Grant',
          'Online Multimedia',
          'Web Page'
        ]
      },
      target: {
        type: [
          'chapter',
          'classic',
          'dataset',
          'entry-dictionary',
          'post',
          'post-weblog',
          'software',
          'webpage'
        ]
      }
    },
    convert: CONVERTERS.YEAR
  },
  {
    source: 'D',
    target: 'event-date',
    when: { source: { 0: ['Conference Proceedings'] }, target: false },
    convert: CONVERTERS.DATE
  },
  {
    source: 'E',
    target: 'editor',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Blog',
          'Book Section',
          'Conference Paper',
          'Conference Proceedings',
          'Dictionary',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Music',
          'Serial'
        ]
      },
      target: {
        type: [
          'chapter',
          'entry-dictionary',
          'entry-encyclopedia',
          'musical_score',
          'paper-conference',
          'periodical',
          'post',
          'post-weblog',
          'song'
        ]
      }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'E',
    target: 'collection-editor',
    when: {
      source: {
        0: [
          'Audiovisual Material',
          'Book',
          'Classical Work',
          'Computer Program',
          'Edited Book',
          'Map',
          'Online Multimedia',
          'Report',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article', 'book',
          'classic', 'map',
          'report', 'software',
          'webpage'
        ]
      }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'E',
    target: 'recipient',
    when: {
      source: { 0: ['Personal Communication'] },
      target: { type: ['personal_communication'] }
    }
  },
  {
    source: 'F',
    target: 'citation-key',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'G',
    target: 'language',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'I',
    target: 'publisher',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Blog',
          'Book',
          'Book Section',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Hearing',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Personal Communication',
          'Serial',
          'Standard',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-magazine',
          'article-newspaper',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'Y', // ['I'],
    target: 'publisher',
    when: { source: { 0: ['Report'] }, target: { type: ['report'] } }
  },
  {
    source: 'J',
    target: 'container-title',
    when: {
      source: { 0: ['Journal Article'] },
      target: { type: ['article-journal'] }
    }
  },
  {
    source: 'K',
    target: 'keyword',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'L',
    target: 'call-number',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'N',
    target: 'number',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Audiovisual Material',
          'Bill',
          'Chart or Table',
          'Dictionary',
          'Equation',
          'Figure',
          'Generic',
          'Government Document',
          'Hearing',
          'Thesis',
          'Unpublished Work'
        ]
      },
      target: {
        type: [
          'article',
          'bill',
          'document',
          'entry-dictionary',
          'figure',
          'hearing',
          'thesis'
        ]
      }
    }
  },
  {
    source: 'N',
    target: 'issue',
    when: {
      source: {
        0: [
          'Conference Paper',
          'Conference Proceedings',
          'Electronic Article',
          'Journal Article',
          'Magazine Article'
        ]
      },
      target: {
        type: ['article-journal', 'article-magazine', 'paper-conference']
      }
    }
  },
  {
    source: 'N',
    target: 'collection-number',
    when: {
      source: {
        0: [
          'Book',
          'Book Section',
          'Catalog',
          'Classical Work',
          'Edited Book',
          'Electronic Chapter',
          'Pamphlet',
          'Serial'
        ]
      },
      target: {
        type: [
          'book',
          'chapter',
          'classic',
          'entry',
          'pamphlet',
          'periodical'
        ]
      }
    }
  },
  {
    source: 'N',
    target: 'page-first',
    when: {
      source: {
        0: ['Legal Rule or Regulation', 'Newspaper Article', 'Standard']
      },
      target: { type: ['article-newspaper', 'regulation', 'standard'] }
    }
  },
  {
    source: 'N',
    target: 'status',
    when: { source: { 0: ['Grant'] }, target: false }
  },
  {
    source: 'N',
    target: 'accessed',
    when: {
      source: { 0: ['Web Page'] },
      target: { type: ['webpage'] }
    },
    convert: CONVERTERS.DATE
  },
  {
    source: 'P',
    target: 'page',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Bill',
          'Book Section',
          'Catalog',
          'Conference Paper',
          'Conference Proceedings',
          'Dictionary',
          'Electronic Article',
          'Encyclopedia',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Unpublished Work'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'chapter',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'hearing',
          'legislation',
          'manuscript',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'regulation',
          'report',
          'song',
          'standard'
        ]
      }
    }
  },
  {
    source: 'P',
    target: 'page-first',
    when: { source: { 0: ['Case'] }, target: { type: ['legal_case'] } }
  },
  {
    source: 'P',
    target: 'number-of-pages',
    when: {
      source: {
        0: [
          'Book',
          'Classical Work',
          'Edited Book',
          'Electronic Book',
          'Electronic Chapter',
          'Thesis'
        ]
      },
      target: { type: ['book', 'classic', 'thesis'] }
    }
  },
  {
    source: 'P',
    target: 'dimensions',
    when: {
      source: { 0: ['Film or Broadcast'] },
      target: { type: ['broadcast', 'motion_picture'] }
    }
  },
  {
    source: 'Q',
    target: 'title',
    when: {
      source: {
        '0': [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'classic',
          'dataset',
          'document',
          'entry',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ],
        'original-title': true
      }
    }
  },
  {
    source: 'T',
    target: 'original-title',
    when: {
      source: {
        '0': [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ],
        Q: true
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'classic',
          'dataset',
          'document',
          'entry',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'T',
    target: 'title',
    when: {
      source: {
        '0': [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ],
        Q: false
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'classic',
          'dataset',
          'document',
          'entry',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ],
        'original-title': false
      }
    }
  },
  {
    source: '1',
    target: 'title',
    when: {
      source: {
        0: ['Book Section', 'Dictionary', 'Electronic Chapter', 'Encyclopedia', 'Serial']
      },
      target: {
        type: ['chapter', 'entry-dictionary', 'entry-encyclopedia', 'periodical']
      }
    }
  },
  {
    source: '&',
    target: 'title',
    when: { source: { 0: ['Book Section', 'Serial'], 1: false }, target: false }
  },
  {
    source: 'T',
    target: 'container-title',
    when: {
      source: {
        0: ['Book Section', 'Dictionary', 'Electronic Chapter', 'Encyclopedia', 'Serial']
      },
      target: {
        type: ['chapter', 'entry-dictionary', 'entry-encyclopedia', 'periodical']
      }
    }
  },
  {
    source: 'R',
    target: 'DOI',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'S',
    target: 'collection-title',
    when: {
      source: {
        0: [
          'Book Section',
          'Conference Proceedings',
          'Dataset',
          'Electronic Book',
          'Electronic Chapter',
          'Government Document',
          'Music',
          'Serial'
        ]
      },
      target: {
        type: ['chapter', 'dataset', 'musical_score', 'periodical', 'song']
      }
    }
  },
  {
    source: 'U',
    target: 'URL',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Blog',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'post',
          'post-weblog',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: 'V',
    target: 'issue',
    when: {
      source: { 0: ['Statute'] },
      target: { type: ['legislation'] }
    }
  },
  {
    source: 'V',
    target: 'volume',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Audiovisual Material',
          'Bill',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Classical Work',
          'Conference Paper',
          'Conference Proceedings',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Generic',
          'Government Document',
          'Journal Article',
          'Magazine Article',
          'Manuscript',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Report',
          'Serial'
        ]
      },
      target: {
        type: [
          'article-journal', 'article-magazine',
          'article-newspaper', 'bill',
          'book', 'chapter',
          'classic', 'document',
          'entry', 'entry-dictionary',
          'entry-encyclopedia', 'legal_case',
          'manuscript', 'musical_score',
          'paper-conference', 'periodical',
          'report', 'song'
        ]
      }
    }
  },
  {
    source: 'V',
    target: 'edition',
    when: {
      source: { 0: ['Computer Program'] },
      target: { type: ['software'] }
    }
  },
  {
    source: 'V',
    target: 'dimensions',
    when: {
      source: { 0: ['Chart or Table', 'Equation', 'Figure'] },
      target: { type: ['figure'] }
    }
  },
  {
    source: 'V',
    target: 'number',
    when: {
      source: { 0: ['Pamphlet'] },
      target: { type: ['pamphlet'] }
    }
  },
  {
    source: 'V',
    target: 'version',
    when: { source: { 0: ['Patent'] }, target: { type: ['patent'] } }
  },
  {
    source: ['[', 'V'],
    target: 'accessed',
    when: {
      source: { 0: ['Blog'] },
      target: { type: ['post', 'post-weblog'] }
    },
    convert: CONVERTERS.DATE
  },
  {
    source: 'X',
    target: 'abstract'
  },
  {
    source: '7',
    target: 'abstract',
    when: {
      source: {
        0: ['Manuscript', 'Personal Communication'],
        X: false
      },
      target: false
    }
  },
  {
    source: 'P',
    target: 'abstract',
    when: {
      source: {
        0: [
          'Artwork',
          'Blog',
          'Chart or Table',
          'Computer Program',
          'Equation',
          'Figure',
          'Map',
          'Web Page'
        ],
        X: false
      },
      target: false
    }
  },
  {
    source: 'Y',
    target: 'editor',
    when: { source: { 0: ['Book'] }, target: { type: ['book'] } },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'Y',
    target: 'collection-editor',
    when: {
      source: {
        0: [
          'Book Section',
          'Conference Proceedings',
          'Electronic Book',
          'Electronic Chapter',
          'Music',
          'Serial'
        ]
      },
      target: { type: ['chapter', 'musical_score', 'periodical', 'song'] }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'Y',
    target: 'illustrator',
    when: {
      source: { 0: ['Blog'] },
      target: { type: ['post', 'post-weblog'] }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'Y',
    target: 'producer',
    when: {
      source: { 0: ['Film or Broadcast'] },
      target: { type: ['broadcast', 'motion_picture'] }
    },
    convert: CONVERTERS.NAMES
  },
  {
    source: 'Z',
    target: 'note',
    when: {
      source: {
        0: [
          'Aggregated Database',
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Book',
          'Book Section',
          'Case',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Article',
          'Electronic Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Online Database',
          'Online Multimedia',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work',
          'Web Page'
        ]
      },
      target: {
        type: [
          'article',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legal_case',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'report',
          'software',
          'song',
          'standard',
          'thesis',
          'webpage'
        ]
      }
    }
  },
  {
    source: '[',
    target: 'accessed',
    when: {
      source: {
        0: [
          'Ancient Text',
          'Artwork',
          'Audiovisual Material',
          'Bill',
          'Book',
          'Book Section',
          'Catalog',
          'Chart or Table',
          'Classical Work',
          'Computer Program',
          'Conference Paper',
          'Conference Proceedings',
          'Dataset',
          'Dictionary',
          'Edited Book',
          'Electronic Chapter',
          'Encyclopedia',
          'Equation',
          'Figure',
          'Film or Broadcast',
          'Generic',
          'Government Document',
          'Grant',
          'Hearing',
          'Journal Article',
          'Legal Rule or Regulation',
          'Magazine Article',
          'Manuscript',
          'Map',
          'Music',
          'Newspaper Article',
          'Pamphlet',
          'Patent',
          'Personal Communication',
          'Report',
          'Serial',
          'Standard',
          'Statute',
          'Thesis',
          'Unpublished Work'
        ]
      },
      target: {
        type: [
          'article',
          'article-journal',
          'article-magazine',
          'article-newspaper',
          'bill',
          'book',
          'broadcast',
          'chapter',
          'classic',
          'dataset',
          'document',
          'entry',
          'entry-dictionary',
          'entry-encyclopedia',
          'figure',
          'graphic',
          'hearing',
          'legislation',
          'manuscript',
          'map',
          'motion_picture',
          'musical_score',
          'pamphlet',
          'paper-conference',
          'patent',
          'periodical',
          'personal_communication',
          'regulation',
          'report',
          'software',
          'song',
          'standard',
          'thesis'
        ]
      }
    }
  },
  {
    source: ']',
    target: 'number',
    when: {
      source: { 0: ['Journal Article'] },
      target: { type: ['article-journal'] }
    }
  },
  {
    source: ']',
    target: 'PMCID',
    when: {
      source: { 0: ['Electronic Book', 'Electronic Chapter'] },
      target: false
    }
  }
]

export const translator = new util.Translator(MAPPINGS)
