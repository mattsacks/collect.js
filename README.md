# Collector.js

Sorta like MapReduce. (currently) Not distributed.

## How to use
Including Collector.js on your page will expose two variables, `Collector` and
`collector` on the `window` object. `Collector` is a class for creating
instances of itself, `collector` is a vanilla instantiation.

`.collect(_data_, _mappings_, _reductions_)` - the main function, it takes in a
dataset and runs a unique mapping across each item of data. if reductions, is
provided - it will run those over the mapped dataset.

* `data` (Array): an array of data to iterate across
* `mappings` (Object): an object of keys to functions that will be called on each
  datum in data. mapping signature should look like `function(datum, i,
  dataset)` where dataset is an empty array of the returned result
* `reductions` ( _optional_ Object): an object of identical keys to that of
  `mappings` that gets called after each mapping is called on data. iff the
  mapping function **returns** a result, the signature will be `function(result,
  datum, i)` otherwise it will be identical to that of the `mappings` function
  signature.

`.total(_collection_, _mappings_)` - an additional function to run mappings
across a dataset that had been previously collected: 

* `collection` (Object): an object of unique keys corresponding to an array of
  data as it's value. assumed to be the result of `collector.collect()`
* `mappings` (Object): similar to `.collect`, this object needs to have
  identical keys to that of `collection` where the value is a function that will
  get processed on the dataset. function signature is `function(dataset)`.

## Example
Let's do a default map and reduction and also use closures for a rolling
reduction.

```javascript
var data = [2, 1, 0];
var sum  = 0;

var mappings = {
  test: function(x, i, dataset) {
    return i;
  },
  closured: function(x, i, dataset) {
    return x;
  }
};

var reductions = {
  test: function(result, x, i, dataset) {
    // this is effectively i + 1, but map this result as well
    return result + 1;
  },
  closured: function(result, x, i, dataset) {
    sum += result;
  }
}

var collection = collector.collect(data, mappings, reductions);
collection.test; // [1, 2, 3]
sum === 3; // true, the sum of 2 + 1 + 0
```

## License
(The MIT License)

Copyright (c) 2011 Matt Sacks &lt;matt.s.sacks@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
