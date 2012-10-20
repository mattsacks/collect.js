;(function(/* exports */) {
  var utils = {};

  function Collector(options) {
    this.options = options || {};
  };

  // configure the Collector object with updated options.
  // - **config** (Object: {}) updated config
  // - **reset** (Boolean: _false_) if the options should be reset to the
  // defaults + the passed in configuration object
  Collector.prototype.configure = function(config, reset) {
  };

  // core function - loops over an array of data and applies a mapping function
  // for each object in the array. after each mapping is applied, a rolling
  // reduction is then called onto the datum. for post-reduction, use
  // Collector.total
  // - **data** (Array: []) array of objects to apply mappings to
  // - **mappings** (Object: {}) an object of unique keys whose values are
  // functions that will be called onto each object in the data
  // - **reductions** (Object: {}) similar to mappings, these are functions
  // called after mapping a datum. each key needs to be exact to the same key in
  // mappings to coordinate the data.
  //
  // TODO:
  // - support webworkers based on data length and options configuration
  Collector.prototype.collect = function(data, mappings, reductions) {
    if (data == null || data.length === 0) return;
    if (mappings == null || typeof mappings !== 'object') return;

    // the returned object
    var collection = {};

    for (var key in mappings) {
      var map = mappings[key];
      collection[key] = collection[key] || [];

      // TODO use utils.each?
      data.forEach(function(datum, i) {
        map(datum, collection[key], i);
      });
    };

    // the result
    return collection;
  };

  window.Collector = Collector;
  window.collector = new Collector;
})();
