// collect.js v1
// by Matt Sacks <matt.s.sacks@gmail.com>

;(function() {
  "use strict";

  // Check if item is an array. Defaults to ES5.
  var isArray = Array.isArray || function isArray(item) {
    return item.toString() == '[object Array]';
  };

  // Raw implementation of Array.map
  //
  // array (Array) - An array to iterate across
  // map (Function) - A map function to call for each item in array
  function arrayMap(array, map) {
    var results = [];
    for (var i = 0, len = array.length; i < len; i++) {
      results.push(map.call(array, array[i], i));
    }
    return results;
  };

  // Implement Object.map(value, key)
  //
  // obj (Object) - An object of keys and values to iterate across
  // map (Function) - A map function to call for each (value, key) in obj
  function objMap(obj, map) {
    var results = [];
    for (var key in obj) {
      results.push(map.call(obj, obj[key], key));
    }
    return results;
  };

  // Return an appropriate map function for the given type of data
  //
  // data (Object, Array) - either an object or array to iterate on
  function typeMap(data) {
    // fn (Function) - the iterator to use for the given data-type
    var fn = isArray(data) ? arrayMap : objMap;
    return function(map) {
      return fn(data, map);
    };
  };

  // Figure out the map function for the given array
  //
  // data (Object, Array) - either an object or array to iterate on
  function getMap(data) {
    // get the correct iterating map function for the data type
    var mapFn = typeMap(data);
    // return a function that accepts a map callback function.
    // if one isn't defined, return the data. otherwise, map.
    return function(map) {
      return map == null ? data : mapFn(map);
    };
  };

  // Return a function with reference to the aggregate collection for initial
  // values.
  //
  // collection (Object) - The aggregate collection from collect()
  function getReduce(collection) {
    return function(data, fn, result) {
      result = typeof result == 'string' && collection[result] != null ?
        collection[result] : result;

      for (var i = 0, len = data.length; i < len; i++) {
        result = fn.call(data, result, data[i], i);
      }
      return result;
    };
  };

  // DRYd up code that calls a map function for the data passed into collect.
  //
  // map (Function) - mapping function defined by getMap()
  // reduce (Function) - reduce function defined by getReduce()
  function getMapReduce(map, reduce) {
    // return a function that takes an object with callbacks defined.
    // fns (Object) - has a map() and/or a reduce() that may have a init value
    // newMap(
    return function(fns, newMap) {
      var mapFn = fns.map;
      var reduceFn = fns.reduce;
      var init = fns.init;

      var mapped = (newMap || map)(mapFn);
      return reduceFn == null ? mapped : reduce(mapped, reduceFn, init);
    }
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
    // get a cached mapreduce function with a map and reduce callback defined
    var mapreduce = getMapReduce(getMap(data), getReduce(collection));

    if (maps.map != null || maps.reduce != null) {
      return mapreduce(maps);
    }
    else {
      for (var key in maps) {
        var fns = maps[key];
        var altMap = null;

        // if the 'data' attribute is defined and exists on the collection,
        // use that as the data source
        if (typeof fns.data == 'string' && collection[fns.data] != null) {
          altMap = getMap(collection[fns.data]);
        }
        collection[key] = mapreduce(fns, altMap);
      }
      return collection;
    }
  };

  typeof exports != 'undefined' ?
    module.exports = collect :
    window.collect = collect;
})();
