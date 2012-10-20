// setup tests
var Test = {};

Test.map = function(data, mappings) {
  // simple test for datum and mappings if none are provided
  data = data || ['one', 'two', 'three'];
  mappings = mappings || {
    test: function(x, bin, i) {
      bin[x] = (i + 1) * 2;
    }
  };

  return collector.collect(data, mappings);
};

// actual testing
describe("setup", function() {
  describe("initialization", function() {
    it("exposes the right stuff", function() {
      expect(Collector).not.to.be(undefined);
      expect(collector).not.to.be(undefined);
      expect(window['utils']).to.be(undefined);
    });
  });
});

describe("core", function() {
  describe("collect", function() {
    it("loops through data and calls mappings on each datum", function() {
      var result = Test.map();
      expect(result).to.be.ok();
    });
  });
});
