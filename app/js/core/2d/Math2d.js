var Math2d;

Math2d = (function() {
  function Math2d() {}

  Math2d.distance = function(v1, v2) {
    var dx, dy;
    dx = v2.x - v1.x;
    dy = v2.y - v1.y;
    return dx * dx + dy * dy;
  };

  Math2d.distanceSqrt = function(v1, v2) {
    var dx, dy;
    dx = v2.x - v1.x;
    dy = v2.y - v1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return Math2d;

})();
