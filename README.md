# collect.js

MapReduce Utility

## What
Utility that calls one or more `map()` and `reduce()` functions over a series of
data.

## Install

```shell
npm install mattsacks/collect.js
```

## Setup
Only the `collect()` function is exposed.

In node:

```javascript
var collect = require('collect');
```

In the browser:

```html
<body>
  ...
  <script src="collect.min.js"></script>
</body>
```

## Docs

`collect(data, maps[, options])`

The main function, it takes in a dataset and over each item, it runs a `map` and
`reduce` function found for each key in `maps`.

* `data` (Array): an array of data to iterate across
* `maps` (Object): an object of keys, each value being an object with a `map`
  and `reduce` function defined
* `options` (_optional_ Object): a hash of options. Currently unused.

## Example
A simple map and reduction using numbers.

```javascript
var data = [0, 1, 2];

var maps = {
  plusOne: {
    map: function(x, i) {
      return x + 1;
    }
  },
  sum: {
    reduce: function(result, current, x, i) {
      return result == null ? current : current + result;
    }
  }
};

collect(data, maps); // { plusOne: [1, 2, 3], sum: 3 }

maps.plusOneSum = {
  map: maps.plusOne.map,
  reduce: maps.sum.reduce
};

collect(data, maps); // { plusOne: [1, 2, 3], sum: 3, plusOneSum: 6 }
collect(data, maps.plusOneSum); // 6
```
