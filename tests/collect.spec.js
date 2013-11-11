// actual testing
describe("collect", function() {
  var data, hash, maps;

  beforeEach(function() {
    // defaults
    data = [0, 1, 2];
    hash = { zero: 0, one: 1, two: 2 };
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

  it("calls a top-level map function", function() {
    var map = { map: maps.test.map };
    var result = collect(data, map);
    expect(result).to.be.ok();
    expect(result).to.be.eql([1, 2, 3]);
  });

  it("calls a top-level reduce function", function() {
    var reduce = { reduce: maps.test.reduce };
    var result = collect(data, reduce);
    expect(result).to.be.ok();
    expect(result).to.be.eql(3);
  });

  it("can map object values", function() {
    var map = { map: maps.test.map };
    var result = collect(hash, map);

    expect(result).to.be.ok();
    expect(result).to.be.eql([1, 2, 3]);
  });

  it("can map object keys", function() {
    var map = function(val, key) {
      return key;
    };
    var reduce = maps.test.reduce;
    var result = collect(hash, { map: map, reduce: reduce });

    expect(result).to.be.ok();
    expect(result).to.be.eql("twoonezero");
  });

  it("loops through data and calls mappings on each datum", function() {
    var result = collect(data, maps);
    expect(result).to.be.ok();
    expect(result.test).to.be.ok();
    expect(result.test).to.be.eql(6);
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

