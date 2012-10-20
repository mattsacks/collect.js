// setup tests
var Test = {};

// actual testing
describe("setup", function() {
  describe("initialization", function() {
    it("exposes the right stuff", function() {
      expect(Collector).not.to.be(undefined);
      expect(collector).not.to.be(undefined);
      // TODO test local functions
    });
  });
});

// if none are provided, some samples
Test.samples = function() {
  var data, mappings, reductions, postReductions;
  data = [0, 1, 2];
  mappings = {
    test: function(x, i, dataa) {
      var z = x + 2;
      dataa[i] = z; // set it to test if an even number
      return z;
    }
  };
  reductions = {
    test: function(z, x, i, dataa) {
      // test if it's an odd number
      dataa[i] = z - 1;
    }
  };
  postReductions = {
    test: function(bin) {
      // make it even AGAIN!
      return bin.map(function(x) {
        return x += 1;
      });
    }
  };

  return [data, mappings, reductions, postReductions];
};


// just to see if mappings still works
Test.map = function(data, mappings) {
  return collector.collect(data, mappings);
};

// tests the rest of the collection doings
Test.collect = function(data, mappings, reductions) {
  return collector.collect(data, mappings, reductions);
};

// totals the rest of the collection doings
Test.total = function(collection, reductions) {
  return collector.total(collection, reductions);
};

describe("core", function() {
  var samples, data, mappings, reductions, postReductions;

  beforeEach(function() {
    samples        = Test.samples();
    data           = samples[0];
    mappings       = samples[1];
    reductions     = samples[2];
    postReductions = samples[3];
  });

  describe("collect", function() {
    it("loops through data and calls mappings on each datum", function() {
      var result = Test.map(data, mappings);
      expect(result).to.be.ok();
      expect(result.test).to.be.ok();

      // reductions shouldn't have been run, so make sure the index is even
      expect(result.test[0] % 2).to.be(0);
    });

    it("loops through the data and reduces the mappings", function() {
      var result = Test.collect(data, mappings, reductions);
      expect(result).to.be.ok();
      expect(result.test).to.be.ok();

      // reductions on index are odd
      expect(result.test[0] % 2).not.to.be(0);
    });
  });

  describe("total", function(){
    it("loops through the collection and calls a reduction", function() {
      var result = collector.collect(data, mappings, reductions);
      collector.total(result, postReductions);

      expect(result).to.be.ok();
      expect(result.test).to.be.ok();
      expect(result.test[0] % 2).to.be(0);
    });
  });
});

describe("extra", function() {
  describe("tips", function() {
    it("uses closures for awesomeness", function() {
      var data = [];
      var mappings = {
        test: function(x, bin) {
          // TODO
        }
      };
    });
  });
});
