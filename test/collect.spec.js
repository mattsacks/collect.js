// actual testing
describe("collect", function() {
  var data, hash, maps;

  beforeEach(function() {
    // defaults
    data = [0, 1, 2];
    hash = {zero: 0, one: 1, two: 2};
    maps = {
      test: {
        map: function(x, i) {
          return x + 1;
        },
        reduce: function(res, cur) {
          return res + cur;
        },
        init: 0
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
    var reduce = { reduce: maps.test.reduce, init: 0 };
    var result = collect(data, reduce);
    expect(result).to.be.ok();
    expect(result).to.be.eql(3);
  });

  it("supports initial values in reduce", function() {
    var mapreduce = maps.test;
    var result = collect(data, mapreduce);
    expect(result).to.be.ok();
    expect(result).to.be.eql(6);
  });

  it("can map object values", function() {
    var map = {map: maps.test.map};
    var result = collect(hash, map);

    expect(result).to.be.ok();
    expect(result).to.be.eql([1, 2, 3]);
  });

  it("can map object keys", function() {
    var map = function(val, key) {
      return key;
    };
    var reduce = maps.test.reduce;
    var result = collect(hash, {map: map, reduce: reduce, init: ''});

    expect(result).to.be.ok();
    expect(result).to.be.eql("zeroonetwo");
  });

  it("loops through data and calls mappings on each datum", function() {
    var result = collect(data, maps);
    expect(result).to.be.ok();
    expect(result.test).to.be.ok();
    expect(result.test).to.be.eql(6);
  });

  it("can use previously collected data", function() {
    var multipleReduce = {
      test: {
        map: function(x) {
          return x + 1;
        }
      },
      first: {
        data: 'test',
        reduce: function(result, current) {
          return result + current;
        },
        init: 0
      },
      second: {
        data: 'test',
        reduce: function(result, current) {
          return result * current;
        },
        init: 1
      }
    };

    var result = collect(data, multipleReduce);
    var expected = collect(result.test, {
      first: { reduce: multipleReduce.first.reduce, init: 0 },
      second: { reduce: multipleReduce.second.reduce, init: 1 }
    });

    expect(expected).to.be.ok();
    expect(result).to.be.ok();
    expect(expected.first).to.be.eql(result.first);
    expect(expected.second).to.be.eql(result.second);
  });

  it("can chain results", function() {
    maps.first = {
      map: maps.test.map
    };
    maps.second = {
      data: 'first',
      map: maps.test.map,
      reduce: maps.test.reduce,
      init: 'test'
    };
    
    var result = collect(data, maps);
    expect(result).to.be.ok();
    expect(15).to.be.eql(result.second);
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
        return res + cur;
      },
      init: 0
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

