var LoaderScene, VisualPoint,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LoaderScene = (function(_super) {
  __extends(LoaderScene, _super);

  LoaderScene.prototype.percent = 0;

  LoaderScene.prototype.points = null;

  LoaderScene.prototype.loaded = false;

  function LoaderScene() {
    this.onLoadingFinish = __bind(this.onLoadingFinish, this);
    this.onUpdatePercent = __bind(this.onUpdatePercent, this);
    this.onTextureLoaded = __bind(this.onTextureLoaded, this);
    var i, loader, p, _i;
    LoaderScene.__super__.constructor.call(this);
    this.points = [];
    for (i = _i = 0; _i < 100; i = _i += 1) {
      p = new VisualPoint();
      this.points.push(p);
      this.addChild(p);
    }
    this.resize();
    loader = new PIXI.AssetLoader(['./textures/01.json'], false);
    loader.addEventListener('onComplete', this.onTextureLoaded);
    loader.load();
    TweenLite.to(this, 30, {
      percent: .5,
      ease: Quad.easeInOut,
      onUpdate: this.onUpdatePercent
    });
    window.setTimeout(function() {
      return $('.credit').addClass('activate');
    }, 200);
    return;
  }

  LoaderScene.prototype.onTextureLoaded = function() {
    TweenLite.to(this, 1, {
      percent: 1,
      ease: Quad.easeInOut,
      onUpdate: this.onUpdatePercent
    });
  };

  LoaderScene.prototype.resize = function() {
    var i, p, _i, _ref;
    if (!this.loaded) {
      for (i = _i = 0, _ref = this.points.length; _i < _ref; i = _i += 1) {
        p = this.points[i];
        p.position.x = window.innerWidth * (i / this.points.length);
        p.position.y = window.innerHeight / 2;
      }
    }
  };

  LoaderScene.prototype.update = function(dt) {};

  LoaderScene.prototype.onUpdatePercent = function() {
    var i, max, _i, _j;
    max = Math.floor(this.percent * 100);
    for (i = _i = 0; _i < max; i = _i += 1) {
      this.points[i].show();
    }
    if (max === 100) {
      for (i = _j = 0; _j < 99; i = _j += 1) {
        this.points[i].migrateToCenter();
      }
      this.points[99].migrateToCenter(this.onLoadingFinish);
    }
  };

  LoaderScene.prototype.onLoadingFinish = function() {
    SceneTraveler.to(new ArrowsScene());
  };

  return LoaderScene;

})(Scene);

VisualPoint = (function(_super) {
  __extends(VisualPoint, _super);

  VisualPoint.prototype.showed = false;

  function VisualPoint() {
    VisualPoint.__super__.constructor.call(this);
    this.showed = false;
    this.draw();
    this.alpha = 0;
    this.scale.x = .8;
    this.scale.y = .8;
    return;
  }

  VisualPoint.prototype.draw = function() {
    this.clear();
    this.beginFill(0xFFFFFF, 1);
    this.drawRect(0, -window.innerHeight / 2, 1, window.innerHeight);
    this.endFill();
  };

  VisualPoint.prototype.show = function() {
    if (!this.showed) {
      TweenLite.to(this, .4, {
        alpha: 1
      });
      TweenLite.to(this.scale, .4, {
        x: 1,
        y: 1,
        ease: Back.easeOut
      });
      this.showed = true;
    }
  };

  VisualPoint.prototype.migrateToCenter = function(callback) {
    if (callback == null) {
      callback = null;
    }
    TweenLite.to(this.scale, .15, {
      x: 1,
      y: 1 / window.innerHeight,
      ease: Expo.easeOut
    });
    if (callback === null) {
      TweenLite.to(this, .3, {
        delay: .1,
        x: Math.floor(window.innerWidth / 2),
        y: Math.floor(window.innerHeight / 2),
        ease: Quad.easeOut
      });
    } else {
      TweenLite.to(this, .3, {
        delay: .1,
        onComplete: callback,
        x: Math.floor(window.innerWidth / 2),
        y: Math.floor(window.innerHeight / 2),
        ease: Quad.easeOut
      });
    }
  };

  return VisualPoint;

})(PIXI.Graphics);
