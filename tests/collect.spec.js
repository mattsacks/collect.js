// actual testing
describe("setup", function() {
  describe("initialization", function() {
    it("exposes the right stuff", function() {
      expect(collect).to.be.ok();
    });
  });
});


describe("core", function() {
  var samples, data, maps;

  beforeEach(function() {
    // defaults
    data = [0, 1, 2];
    maps = {
      test: {
        map: function(x, i) {
          return x + 1;
        },
        reduce: function(res, cur) {
          return res == null ? cur : cur + res;
        }
      }
    };
  });

  describe("collect", function() {
    it("loops through data and calls mappings on each datum", function() {
      var result = collect(data, maps);
      expect(result).to.be.ok();
      expect(result.test).to.be.ok();

      // reductions shouldn't have been run, so the data should be the same
      expect(result.test).to.be.eql(6);
    });
  });
});

// performance stuff
window.generate = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) data.push(i);
  return data;
};

window.time = function(fn) {
  console.timeEnd('a');
  console.time('a');
  var res = fn();
  console.timeEnd('a');
  return res;
};

window.perf = {
  maps: {
    test: {
      map: function(x) { return x + 1 },
      reduce: function(res, cur) {
        return res == null ? cur : cur + res;
      }
    }
  },
  data: window.generate(10000),
  // use as time(perf.fn)
  time: function() {
    return time(perf.fn);
  },
  fn: function() {
    return collect(perf.data, perf.maps);
  }
};

