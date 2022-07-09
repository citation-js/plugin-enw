# @citation-js/plugin-enw

Thie plugin adds support for [.enw files](https://en.wikipedia.org/wiki/EndNote#Import_format).

[![NPM version](https://img.shields.io/npm/v/@citation-js/plugin-enw.svg)](https://npmjs.org/package/@citation-js/plugin-enw)
[![Codecov](https://img.shields.io/codecov/c/gh/citation-js/plugin-enw)](https://app.codecov.io/gh/citation-js/plugin-enw)
[![NPM total downloads](https://img.shields.io/npm/dt/@citation-js/plugin-enw.svg)](https://npmcharts.com/compare/@citation-js%2Fplugin-enw?minimal=true)
![License](https://img.shields.io/npm/l/@citation-js/plugin-enw.svg)

## Install

```js
npm install @citation-js/plugin-enw
```

## Use

Install the plugin by `require`-ing it:

```js
require('@citation-js/plugin-enw')
```

## Formats

### Input

**`@enw/file`**

A text file in the `.enw` format.

```js
const data = Cite(`%0 Journal Article
%A Willighagen, Lars G.
%E Peroni, Silvio
%P e214
%V 5
%J PeerJ Computer Science
%T Citation.js: a format-independent, modular bibliography tool for the browser and command line
%8 2019-08-12
%R 10.7717/peerj-cs.214
%@ 2376-5992
%U https://peerj.com/articles/cs-214/
`)

data.format('data', { format: 'object' }) // returns:
{
  author: [{ family: 'Willighagen', given: 'Lars G.' }],
  editor: [{ family: 'Peroni', given: 'Silvio' }],
  page: 'e214',
  volume: '5',
  'container-title': 'PeerJ Computer Science',
  title: 'Citation.js: a format-independent, modular bibliography tool for the browser and command line',
  issued: { 'date-parts': [[2019, 8, 12]] },
  type: 'article-journal',
  DOI: '10.7717/peerj-cs.214',
  ISSN: '2376-5992',
  URL: 'https://peerj.com/articles/cs-214/
}
```

### Output

**`enw`**

```js
data.format('enw', { format: 'text', lineEnding: '\n' })
```

Options:
  - `format` (string): `'text'` (default; for plain text file) or `'object'` (for array of objects)
  - `lineEnding` (string): e.g. `'\n'` (default) or `'\r\n'` (note that refer might not pick up on the latter)
