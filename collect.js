// collect.js v1
// by Matt Sacks <matt.s.sacks@gmail.com>

;(function() {
  "use strict";

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

    // the returned object
    var collection = {};

    var isArray = Array.isArray || function isArray(item) {
      return item.toString() == '[object Array]';
    };

    if (isArray(data)) {
      for (var i = 0, len = data.length; i < len; i++) {
        mapreduce(data[i], i);
      }
    }
    else {
      for (var id in data) {
        mapreduce(data[id], id);
      };
    }

    // for each key available in maps, call the map and/or reduce function
    // found on the datum
    //
    // - **datum** (): Any non-null item to call each mapreduce function on.
    // - **i** (): If the data is an Array, then it will be the datum's index.
    // Otherwise, if the data is an Object, it will be the key for the datum
    // value.
    function mapreduce(datum, i) {
      for (var key in maps) {
        var mapreduce = maps[key];
        var map = mapreduce.map;
        var reduce = mapreduce.reduce;

        if (map == null) return;

        var rolling = collection[key];
        var result = map(datum, i);

        collection[key] = collection[key] || [];
        return reduce == null ?
          collection[key].push(result) :
          collection[key] = reduce(rolling, result, datum, i);
      }
    };

    return collection;
  };

  typeof exports == 'undefined' ?
    window.collect = collect :
    module.exports = collect;
})();
