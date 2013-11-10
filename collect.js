// collect.js v1
// by Matt Sacks <matt.s.sacks@gmail.com>

;(function() {
  "use strict";

  // which iteration loop to use
  var isArray = Array.isArray || function isArray(item) {
    return item.toString() == '[object Array]';
  };

  // if data is an array, use native map. otherwise, use object map
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
          // TODO check for null?
          results.push(map(data[key], key));
        }
        return results;
      };
    }
  };

  // faster implementation of reduce
  function reduce(data, fn) {
    var result = null;
    for (var i = 0, len = data.length; i < len; i++) {
      result = fn(result, data[i], i);
    };
    return result;
  };

  // loops over an array of data and applies a mapping function for each item in
  // the array. after each mapping is applied, a rolling reduction is then
  // called onto the datum.
  // 
  // - **data** (Array): array of data to call mappings and reductions onto
  // - **maps** (Object): an object where each key is an object of a map:
  // and/or reduce: function that will be called on each datum
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

      if (mapFn == null) continue;
      var mapped = map(mapFn);

      if (reduceFn == null) {
        collection[key] = mapped;
        continue;
      }

      collection[key] = reduce(mapped, reduceFn);
    };

    return collection;
  };

  typeof exports == 'undefined' ?
    window.collect = collect :
    module.exports = collect;
})();
