// collector.js v0.1
// by Matt Sacks <matt.s.sacks@gmail.com>

;(function(window) {
  // constructor
  function Collector(options) {
    this.options = options || {};
  };

  // version
  Collector.version = Collector.v = '0.1';

  // loops over an array of data and applies a mapping function for each item in
  // the array. after each mapping is applied, a rolling reduction is then
  // called onto the datum.
  // 
  // - **data** (Array): array of data to call mappings and reductions onto
  // - **mappings** (Object): an object of unique keys whose values are
  // functions that will be called onto each object in the data
  // - **reductions** (Object): similar to mappings, these are functions
  // called after mapping a datum. each key needs to be exact to the same key in
  // mappings to coordinate the data.
  Collector.prototype.collect = function(data, mappings, reductions) {
    if (data == null || mappings == null) return;

    // the returned object
    var collection = {};

    data.forEach(function(datum, i) {
      for (var key in mappings) {
        var map = mappings[key], reduce;
        if (map == null) continue;

        reductions != null && (reduce = reductions[key]);

        // call a map on the piece of data
        var result  = map(datum, i);
        var rolling = collection[key];

        // if a reduce function isn't defined for this key, then just map
        if (reduce == null) {
          collection[key] = collection[key] || [];
          collection[key].push(result);
          return; // continue
        }

        // if there was a result from the mapping, call it as the first
        // argument.  otherwise, same format as the mapping
        result = result != null ?
          reduce(rolling, result, datum, i) :
          reduce(rolling, datum, i);

        if (result != null) collection[key] = result;
      }
    });

    return collection;
  };

  // expose class and default instantiation
  window.Collector = Collector;
  window.collector = new Collector;
})(window);
