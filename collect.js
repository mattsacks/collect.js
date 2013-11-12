// collect.js v1
// by Matt Sacks <matt.s.sacks@gmail.com>

;(function() {
  "use strict";

  // Check if item is an array. Defaults to ES5.
  var isArray = Array.isArray || function isArray(item) {
    return item.toString() == '[object Array]';
  };

  function typeMap(data) {
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
      }
    }
  };

  // Return a callback map function.
  // Native Array.map for Array data. Shorthand map for Objects.
  //
  // data (Object, Array) - either an object or array to iterate on
  function getMap(data, collection) {
    function testMap(map, callback) {
      if (map == null) {
        return data;
      }
      else if (typeof map == 'string' && collection[map] != null) {
        return collection[map];
      }
      else {
        return callback(map);
      }
    };

    var mapFn = typeMap(data);
    return function(map) {
      return testMap(map, mapFn);
    };
  };

  function getReduce(collection) {
    return function(data, fn, result) {
      result = typeof result == 'string' && collection[result] != null ?
        collection[result] : result;

      // Array.reduce is slow
      for (var i = 0, len = data.length; i < len; i++) {
        result = fn(result, data[i], i);
      }
      return result;
    };
  };

  // DRYd up code that calls a map function for the data passed into collect.
  //
  // map (Function) - mapping function defined by getMap()
  // reduce (Function) - reduce function defined by getReduce()
  // fns (Object) - has a map and/or a reduce function defined
  function getMapReduce(map, reduce) {
    return function(fns) {
      var mapFn = fns.map;
      var reduceFn = fns.reduce;
      var init = fns.init;

      var mapped = map(mapFn);
      return reduceFn == null ? mapped : reduce(mapped, reduceFn, init);
    };
  };

  // Loop over a series of data and apply a map and reduce function for each
  // key in the maps argument. 
  // 
  // data (Object, Array) - series of data to iterate over
  // maps (Object) - map and reduce functions. both are optional. if an
  // object with a top-level map and/or reduce function, only call those.
  // otherwise, call map and/or reduce for each key found.
  // options (Object) - options, but none exist yet
  function collect(data, maps, options) {
    if (data == null || data.length === 0 || maps == null) return {};

    var collection = {};
    var mapreduce = getMapReduce(
      getMap(data, collection), getReduce(collection)
    );

    if (maps.map != null || maps.reduce != null) {
      return mapreduce(maps);
    }
    else {
      for (var key in maps) {
        collection[key] = mapreduce(maps[key]);
      }
      return collection;
    }
  };

  typeof exports != 'undefined' ?
    module.exports = collect :
    window.collect = collect;
})();
