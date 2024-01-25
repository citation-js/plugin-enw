/* eslint-env mocha */

import '../src/'

import assert from 'assert'
import { plugins } from '@citation-js/core'

const apiTests = [
  {
    name: 'hal-03701250v1',
    input: `%0 Unpublished work
%8 2022-06-21
%D 2022
%A GPT
%A Osmanovic Thunström, Almira
%A Steingrimsson, Steinn
%G English
%T Can GPT-3 write an academic paper on itself, with minimal human input?
%U https://hal.archives-ouvertes.fr/hal-03701250
%X Lorem ipsum dolor sit amet
%Z Computer Science [cs]Preprints, Working Papers, ...
%2 https://hal.archives-ouvertes.fr/hal-03701250/document
%2 https://hal.archives-ouvertes.fr/hal-03701250/file/GPT-3%20et%20al%202022%20NLE%20sub.pdf
%L hal-03701250
%+ OpenAI
%+ Sahlgrenska University Hospital [Gothenburg]
%+ Sahlgrenska Academy at University of Gothenburg [Göteborg]`,
    data: [{
      URL: 'https://hal.archives-ouvertes.fr/hal-03701250',
      abstract: 'Lorem ipsum dolor sit amet',
      author: [
        { family: 'GPT' },
        { family: 'Osmanovic Thunström', given: 'Almira' },
        { family: 'Steingrimsson', given: 'Steinn' }
      ],
      issued: { 'date-parts': [[2022, 6, 21]] },
      language: 'English',
      note: 'Computer Science [cs]Preprints, Working Papers, ...',
      title: 'Can GPT-3 write an academic paper on itself, with minimal human input?',
      type: 'article'
    }],
    output: `%0 Unpublished Work
%8 2022-06-21
%D 2022
%A GPT
%A Osmanovic Thunström, Almira
%A Steingrimsson, Steinn
%G English
%T Can GPT-3 write an academic paper on itself, with minimal human input?
%U https://hal.archives-ouvertes.fr/hal-03701250
%X Lorem ipsum dolor sit amet
%Z Computer Science [cs]Preprints, Working Papers, ...
`
  },
  {
    name: 'pericles_16000463126',
    input: `%0 Journal Article
%D 2018
%@ 0903-4641
%A Abbassi-Daloii, Tooba
%A Yousefi, Soheil
%A Sekhavati, Mohammad Hadi
%A Tahmoorespur, Mojtaba
%J APMIS
%N 1
%P 65-75
%T Impact of heat shock protein 60KD in combination with outer membrane proteins on immune response against Brucella melitensis
%R https://doi.org/10.1111/apm.12778
%U https://onlinelibrary.wiley.com/doi/abs/10.1111/apm.12778
%V 126
%X Lorem ipsum dolor sit amet`,
    data: [{
      DOI: 'https://doi.org/10.1111/apm.12778',
      ISSN: '0903-4641',
      URL: 'https://onlinelibrary.wiley.com/doi/abs/10.1111/apm.12778',
      abstract: 'Lorem ipsum dolor sit amet',
      issue: '1',
      volume: '126',
      'container-title': 'APMIS',
      issued: { 'date-parts': [[2018]] },
      author: [
        { family: 'Abbassi-Daloii', given: 'Tooba' },
        { family: 'Yousefi', given: 'Soheil' },
        { family: 'Sekhavati', given: 'Mohammad Hadi' },
        { family: 'Tahmoorespur', given: 'Mojtaba' }
      ],
      page: '65-75',
      title: 'Impact of heat shock protein 60KD in combination with outer membrane proteins on immune response against Brucella melitensis',
      type: 'article-journal'
    }],
    output: `%0 Journal Article
%8 2018
%D 2018
%@ 0903-4641
%A Abbassi-Daloii, Tooba
%A Yousefi, Soheil
%A Sekhavati, Mohammad Hadi
%A Tahmoorespur, Mojtaba
%J APMIS
%N 1
%P 65-75
%T Impact of heat shock protein 60KD in combination with outer membrane proteins on immune response against Brucella melitensis
%R https://doi.org/10.1111/apm.12778
%U https://onlinelibrary.wiley.com/doi/abs/10.1111/apm.12778
%V 126
%X Lorem ipsum dolor sit amet
`
  },
  {
    name: 'two',
    input: '%0 Book\n\n%0 Book\n',
    data: [{ type: 'book' }, { type: 'book' }]
  },
  {
    name: 'isbn/issn',
    input: `%0 Map
%@ 9781234567890

%0 Map
%@ 1234-567X
`,
    data: [
      { type: 'map', ISBN: '9781234567890' },
      { type: 'map', ISSN: '1234-567X' }
    ]
  },
  {
    name: 'isbn/issn',
    input: `%0 Map
%@ 9781234567890

%0 Map
%@ 1234-567X
`,
    data: [
      { type: 'map', ISBN: '9781234567890' },
      { type: 'map', ISSN: '1234-567X' }
    ]
  },
  {
    name: 'genre/degree',
    input: `%0 Thesis
%9 Horror

%0 Thesis
%V PhD thesis
`,
    data: [
      { type: 'thesis', genre: 'Horror' },
      { type: 'thesis', genre: 'PhD thesis' }
    ]
  },
  {
    name: 'single author',
    input: `%0 Journal Article
%A Kerr, Graham S
%T An optically thin view of the flaring chromosphere: non-thermal widths in a chromospheric condensation during an X-class solar flare
%B Monthly Notices of the Royal Astronomical Society
%D 2023
%R 10.1093/mnras/stad3135
%J Monthly Notices of the Royal Astronomical Society
%V 527
%N 2
%P 2523-2548
%@ 0035-8711
%[ 12/7/2023
%U https://doi.org/10.1093/mnras/stad3135`,
    data: [
      {
        type: 'article-journal',
        author: [{ given: 'Graham S', family: 'Kerr' }],
        title: 'An optically thin view of the flaring chromosphere: non-thermal widths in a chromospheric condensation during an X-class solar flare',
        'container-title': 'Monthly Notices of the Royal Astronomical Society',
        issued: { 'date-parts': [[2023]] },
        DOI: '10.1093/mnras/stad3135',
        volume: '527',
        issue: '2',
        page: '2523-2548',
        ISSN: '0035-8711',
        accessed: { 'date-parts': [[2023, 7, 12]] },
        URL: 'https://doi.org/10.1093/mnras/stad3135'
      }
    ],
    output: `%0 Journal Article
%8 2023
%D 2023
%@ 0035-8711
%A Kerr, Graham S
%J Monthly Notices of the Royal Astronomical Society
%N 2
%P 2523-2548
%T An optically thin view of the flaring chromosphere: non-thermal widths in a chromospheric condensation during an X-class solar flare
%R 10.1093/mnras/stad3135
%U https://doi.org/10.1093/mnras/stad3135
%V 527
%[ 2023-07-12
`
  }
]

describe('input', function () {
  for (const { name, input, data } of apiTests) {
    it(name, async function () {
      assert.deepStrictEqual(plugins.input.chain(input, { generateGraph: false }), data)
    })
  }
})

describe('output', function () {
  for (const { name, input, data, output = input } of apiTests) {
    it(name, async function () {
      assert.deepStrictEqual(plugins.output.format('enw', data), output)
    })
  }
})

describe('outputSyntax', function () {
  for (const { name, data } of apiTests) {
    it(name, async function () {
      const actual = plugins.input.chainLink(plugins.output.format('enw', data), { generateGraph: false })
      const expected = plugins.output.format('enw', data, { format: 'object' })
      assert.deepStrictEqual(actual, expected)
    })
  }
})
