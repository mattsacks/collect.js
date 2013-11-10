# collect.js

Client-side MapReduce

## Why
By defining functions assigned to unique keys in an object, we can use the
closure to run any code local to whatever the current scope is. Anonymous
functions make this super awesome. 

## NPM

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

`.collect(data, maps[, options])` - the main function, it takes in a
dataset and over each item, it runs a `map` and `reduce` function found for each
key in `maps`.

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
    },
    reduce: function(res, cur, x, i) {
      res = res == null ? [] : res;

      var val = {};
      val[x] = cur;

      res.push(val);
      return res;
    }
  }
};

var collection = collect(data, maps);
collection.plusOne; // [ {0: 1}, {1: 2} , {2: 3} ];
```
