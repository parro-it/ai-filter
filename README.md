# ai-filter

[![Travis Build Status](https://img.shields.io/travis/parro-it/ai-filter/master.svg)](http://travis-ci.org/parro-it/ai-filter)
[![NPM downloads](https://img.shields.io/npm/dt/ai-filter.svg)](https://npmjs.org/package/ai-filter)

> Filter over async iterables.

background details relevant to understanding what this module does

## Async iterable fun

**This module is part of
[Async iterable fun](https://github.com/parro-it/ai-fun), a complete toolset of
modules to work with async iterables.**

## Usage

This example read a text file, filtering only chunks cotnaining a new line:

```js
import filter from 'ai-filter';
import { createReadStream } from "fs";

const stream = createReadStream(`file.txt`, "utf8");
const result = filter(chunk => chunk.contains('\n'), fromStream(stream))
for await (const chunk of result) {
  console.log(chunk);
}
```

## API

## Install

With [npm](https://npmjs.org/) installed, run

```bash
npm install --save ai-filter
```

## See Also

* [`noffle/common-readme`](https://github.com/noffle/common-readme)
* [`parro-it/ai-fun`](https://github.com/parro-it/ai-fun)

## License

MIT
