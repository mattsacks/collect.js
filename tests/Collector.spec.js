// actual testing
describe("setup", function() {
  describe("initialization", function() {
    it("exposes the right stuff", function() {
      expect(Collector).to.be.ok();
      expect(collector).to.be.ok();
    });
  });
});


describe("core", function() {
  var samples, data, mappings, reductions, totals;

  beforeEach(function() {
    // defaults
    data       = [0, 1, 2];
    mappings   = {
      test: function(x, i) {
        return x;
      }
    };
    reductions = {
      test: function(cur, res) {
        // if the total hasn't been created, set it to the current value
        // otherwise, set it to the total + the current value
        return cur == null ? res : cur + res;
      }
    };
  });

  describe("collect", function() {
    it("loops through data and calls mappings on each datum", function() {
      var result = collector.collect(data, mappings);
      expect(result).to.be.ok();
      expect(result.test).to.be.ok();

      // reductions shouldn't have been run, so the data should be the same
      expect(result.test).to.be.eql(data);
    });

    it("loops through the data and reduces the mappings", function() {
      var result = collector.collect(data, mappings, reductions);
      expect(result).to.be.ok();
      expect(result.test).to.be.ok();

      // should be the sum of 0 + 1 + 2;
      expect(result.test).to.be(3);
    });
  });
});

describe("extra", function() {
  describe("tips (see source)", function() {
    it("reduces an object", function() {
      // return an object with the items grouped by whether they're smaller or
      // bigger than 5
      var data = [3, 6, 4, 8];

      var mappings = {
        test: function(x) {
          return x > 5;
        }
      };

      var reductions = {
        test: function(obj, res, num) {
          // create our object setup
          if (obj == null) {
            obj = { smaller: [], bigger: [] };
          }

          // if the result was true, than it's bigger than 5
          // otherwise, it's smaller
          res ? obj.bigger.push(num) : obj.smaller.push(num);

          return obj;
        }
      };

      var result = collector.collect(data, mappings, reductions);
      expect(result).to.be.ok();
      expect(result.test).to.be.ok();
      expect(result.test.smaller).to.be.ok();
      expect(result.test.bigger).to.be.ok();
      expect(result.test.smaller).to.be.eql([3, 4]);
      expect(result.test.bigger).to.be.eql([6, 8]);
    });
  });
});
