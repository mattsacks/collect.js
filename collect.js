// collect.js v1
// by Matt Sacks <matt.s.sacks@gmail.com>

;(function() {
  "use strict";

  // Check if item is an array. Defaults to ES5.
  var isArray = Array.isArray || function isArray(item) {
    return item.toString() == '[object Array]';
  };

  // Return a callback map function.
  // Native Array.map for Array data. Shorthand map for Objects.
  function getMap(data) {
    if (isArray(data)) {
      return function(map) {
        return data.map(map);
      };
    }
    else {
      return function(map) {
        var results = [];
        for (var key in data) {
          results.push(map(data[key], key));
        }
        return results;
      };
    }
  };

  // ES5 Array.reduce is slow.
  function reduce(data, fn) {
    var result = null;
    for (var i = 0, len = data.length; i < len; i++) {
      result = fn(result, data[i], i);
    }
    return result;
  };

  // Loop over a series of data and apply a map and reduce function for each
  // key in the maps argument. 
  // 
  // - **data** (Array): array of data to call mappings and reductions onto
  // - **maps** (Object): map and reduce functions. both are optional. if an
  // object with a top-level map and/or reduce function, only call those.
  // otherwise, call map and/or reduce for each key found
  // - **options** (Object): options, but none exist yet
  function collect(data, maps, options) {
    if (data == null || data.length === 0 || maps == null) return {};

    // the returned hash
    var collection = {};

    // get the iterable mapping function
    var map = getMap(data);

    for (var key in maps) {
      var mapreduce = maps[key];
      var mapFn = mapreduce.map;
      var reduceFn = mapreduce.reduce;

      var mapped = mapFn == null ? data : map(mapFn);

      if (reduceFn == null) {
        collection[key] = mapped;
        continue;
      }

      collection[key] = reduce(mapped, reduceFn);
    }

    return collection;
  };

  typeof exports == 'undefined' ?
    window.collect = collect :
    module.exports = collect;
})();
