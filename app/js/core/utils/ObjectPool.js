var ObjectPool;

ObjectPool = (function() {
  function ObjectPool(create, minSize, maxSize) {
    var _i, _ref;
    this.create = create;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.list = [];
    for (_i = 0, _ref = this.minSize; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
      this.add();
    }
    return;
  }

  ObjectPool.prototype.add = function() {
    return this.list.push(this.create());
  };

  ObjectPool.prototype.checkOut = function() {
    var i;
    if (this.list.length === 0) {
      i = this.create();
    } else {
      i = this.list.pop();
    }
    return i;
  };

  ObjectPool.prototype.checkIn = function(item) {
    if (this.list.length < this.maxSize) {
      this.list.push(item);
    }
  };

  return ObjectPool;

})();
