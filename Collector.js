;(function(/* exports */) {
  // constructor
  function Collector() {};

  // loops over an array of data and applies a mapping function for each object
  // in the array. after each mapping is applied, a rolling reduction is then
  // called onto the datum. for post-reduction, use Collector.total
  // 
  // - **data** (Array): array of data to call mappings and reductions onto
  // - **mappings** (Object): an object of unique keys whose values are
  // functions that will be called onto each object in the data
  // - **reductions** (Object): similar to mappings, these are functions
  // called after mapping a datum. each key needs to be exact to the same key in
  // mappings to coordinate the data.
  Collector.prototype.collect = function(data, mappings, reductions) {
    if (data == null || data.length === 0) return;
    if (mappings == null || typeof mappings !== 'object') return;

    // the returned object
    var collection = {};

    for (var key in mappings) {
      var map = mappings[key], reduce;
      if (map == null) continue;

      reductions != null && (reduce = reductions[key]);

      // a single key's resulting collection
      var dataset = collection[key] = collection[key] || [];

      data.forEach(function(datum, i) {
        var result = map(datum, i, dataset);

        // if a reduce function is defined for this key then call a reduction
        if (reduce != null) {
          // if there was a result from the mapping, call it as the first
          // argument. otherwise, same format as the mapping
          var result = result != null ?
            reduce(result, datum, i, dataset) :
            reduce(datum, i, dataset);
        }

        if (result != null) dataset.push(result);
      });
    }

    return collection;
  };

  // loops over the set of data applies an additional reduction to the bin
  //
  // - **collection** (Object): a collection as a result of calling
  // Collector.collector, or just some object you want to iterate over with
  // specific functions
  // - **mappings** (Object): an object with keys that correspond to keys in
  // collection, for which each value in this object is a function applied to
  // the array stored at the collection's key
  Collector.prototype.total = function(collection, mappings) {
    if (collection == null || typeof collection !== 'object') return;
    if (mappings == null || typeof mappings !== 'object') return;

    for (var key in collection) {
      var map = mappings[key];
      if (map == null) continue;

      var result = map(collection[key]);
      if (result != null) collection[key] = result;
    }
    
    return collection;
  };

  window.Collector = Collector;     // expose the class
  window.collector = new Collector; // expose an initialized collector
})(/* exports */);
