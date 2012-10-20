// setup tests
var Test = {};

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

// if none are provided, some samples
Test.samples = function() {
  var data, mappings, reductions;
  data = ['one', 'two', 'three'];
  mappings = {
    test: function(x, bin, i) {
      // test if it's an even number or double the index + 1
      bin[i] = (i + 1) * 2;
      // test if the index is the string
      bin[x] = i + 1;
      return data[i];
    }
  };
  reductions = {
    test: function(result, x, bin, i) {
      // test if it's an odd number
      bin[i] += 1;
    }
  };

  return [data, mappings, reductions];
};


// just to see if mappings still works
Test.map = function(data, mappings) {
  return collector.collect(data, mappings);
};

// tests the rest of the collection doings
Test.collect = function(data, mappings, reductions) {
  return collector.collect(data, mappings, reductions);
};

describe("core", function() {
  describe("collect", function() {
    var samples, data, mappings, reductions;

    beforeEach(function() {
      samples    = Test.samples();
      data       = samples[0];
      mappings   = samples[1];
      reductions = samples[2];
    });

    it("loops through data and calls mappings on each datum", function() {
      var result = Test.map(data, mappings);
      expect(result).to.be.ok();

      expect(result.test.one).to.be(1);
      expect(result.test.two).to.be(2);
      expect(result.test.three).to.be(3);

      // reductions shouldn't have been run, so make sure the index is even
      expect(result.test[0] % 2).to.be(0);
    });

    it("loops through the data and reduces the mappings", function() {
      var result = Test.collect(data, mappings, reductions);
      expect(result).to.be.ok();

      // reductions on index are odd
      expect(result.test[0] % 2).not.to.be(0);
    });
  });
});
