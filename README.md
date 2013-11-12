# collect.js

MapReduce Utility

## What
Utility that calls one or more `map()` and `reduce()` functions over a series of
data.

## Install

```shell
npm install mattsacks/collect.js
bower install mattsacks/collect.js
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

* `data` (Array, Object): A series of data to run `map` and `reduce`
  functions on.
* `maps` (Object): An object with either a top-level `map` and/or `reduce`
  function defined, or a `map` and/or `reduce` function defined for each key.
* `options` (_optional_ Object): a hash of options. Currently unused.

## Example
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
      return result == null ? current : result + current;
    }
  }
};

collect(data, maps); // { plusOne: [1, 2, 3], sum: 3 }

maps.plusOneSum = {
  map: maps.plusOne.map,
  reduce: function(result, current) {
    return result + current;
  },
  init: 0 // initial value for result
};

collect(data, maps); // { plusOne: [1, 2, 3], sum: 3, plusOneSum: 6 }
collect(data, maps.plusOneSum); // 6
```

## Advanced

#### Reduce mapped data in other maps
```javascript
var data = [0, 1, 2];

// Reference existing maps within 
var maps = {
  plusOne: {
    map: function(x) {
      return x + 1;
    }
  },
  sum: {
    data: 'plusOne',
    reduce: function(result, current) {
      return result + current;
    },
    init: 0
  },
  times: {
    data: 'plusOne',
    reduce: function(result, current) {
      return result * current;
    },
    init: 1
  }
};

collect(data, maps); // { plusOne: [1, 2, 3], sum: 6, times: 6 };
```

#### Context inside of maps
```javascript
var data = [0, 1, 2];

// Reference existing maps within 
var maps = {
  plusOne: {
    map: function(x) {
      return x + 1;
    }
  },
  arrays: {
    data: 'plusOne',
    reduce: function(result, current) {
      result.push(this);
      return result;
    },
    init: []
  }
};

collect(data, maps);
// {
//   plusOne: [1, 2, 3],
//   arrays: [[1, 2, 3], [1, 2, 3], [1, 2, 3]]
// }
```
