;(function(/* exports */) {
  var utils = {};

  function Collector(options) {
    this.options = options || {};
  };

  window.Collector = Collector;
  window.collector = new Collector;
})();
