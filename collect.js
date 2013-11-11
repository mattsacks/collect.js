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

  // data (Array or Object) - data to iterate across
  // map (Function) - mapping function defined by getMap()
  // fns (Object) - has a map and/or a reduce function defined
  function mapreduce(data, map, fns) {
    var mapFn = fns.map;
    var reduceFn = fns.reduce;

    var mapped = mapFn == null ? data : map(mapFn);

    return reduceFn == null ? mapped : reduce(mapped, reduceFn);
  };

  // Loop over a series of data and apply a map and reduce function for each
  // key in the maps argument. 
  // 
  // data (Array) - array of data to call mappings and reductions onto
  // maps (Object) - map and reduce functions. both are optional. if an
  // object with a top-level map and/or reduce function, only call those.
  // otherwise, call map and/or reduce for each key found
  // options (Object) - options, but none exist yet
  function collect(data, maps, options) {
    if (data == null || data.length === 0 || maps == null) return {};

    // get the iterable mapping function
    var map = getMap(data);

    if (maps.map != null || maps.reduce != null) {
      return mapreduce(data, map, maps);
    }
    else {
      var collection = {};
      for (var key in maps) {
        collection[key] = mapreduce(data, map, maps[key]);
      }
      return collection;
    }
  };

  typeof exports != 'undefined' ?
    module.exports = collect :
    window.collect = collect;
})();
