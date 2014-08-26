var AnimatedArrow, Arrow, ArrowsScene, BG, Exit, ExitPoint, Globul, GlobulManager, Hero, Observer, Star, StarArrow, StarArrowEmitter, StarManager, Triangle,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ArrowsScene = (function(_super) {
  __extends(ArrowsScene, _super);

  ArrowsScene.prototype.arrows = null;

  ArrowsScene.prototype.globuls = null;

  ArrowsScene.prototype.exit = null;

  ArrowsScene.prototype.hero = null;

  ArrowsScene.prototype.worldContainer = null;

  ArrowsScene.prototype.starsEmitters = null;

  ArrowsScene.prototype.indicators = null;

  ArrowsScene.prototype.triangles = null;

  ArrowsScene.prototype.isCredit = true;

  ArrowsScene.prototype.observers = null;

  ArrowsScene.prototype.vx = 0;

  ArrowsScene.prototype.vy = 0;

  ArrowsScene.prototype.maxSpeed = 20;

  ArrowsScene.prototype.rTarget = 0;

  ArrowsScene.prototype.gTarget = 0;

  ArrowsScene.prototype.bTarget = 0;

  ArrowsScene.prototype.intensityTarget = 0;

  ArrowsScene.prototype.level = 0;

  ArrowsScene.prototype.ax = 0;

  ArrowsScene.prototype.ay = 0;

  ArrowsScene.prototype.left = false;

  ArrowsScene.prototype.right = false;

  ArrowsScene.prototype.top = false;

  ArrowsScene.prototype.bottom = false;

  function ArrowsScene() {
    this.onKeyup = __bind(this.onKeyup, this);
    this.onKeydown = __bind(this.onKeydown, this);
    var a, jizz, x, y, _i, _j;
    ArrowsScene.__super__.constructor.call(this);
    Arrow.poolInit();
    StarArrow.poolInit();
    ExitPoint.poolInit();
    this.starsEmitters = [];
    this.triangles = [];
    this.arrows = [];
    this.globuls = [];
    this.indicators = [];
    this.observers = [];
    this.background = new BG();
    this.addChild(this.background);
    jizz = 400;
    for (x = _i = 0; _i < 20; x = _i += 1) {
      for (y = _j = 0; _j < 20; y = _j += 1) {
        a = new AnimatedArrow();
        a.position.x = x * 600 + jizz * Math.random() - jizz / 2;
        a.position.y = y * 600 + jizz * Math.random() - jizz / 2;
        this.addChild(a);
        this.arrows.push(a);
      }
    }
    this.exit = new Exit();
    this.exit.position.x = 3000;
    this.exit.position.y = 2000;
    this.hero = new Hero();
    this.hero.position.x = window.innerWidth / 2;
    this.hero.position.y = 5000;
    this.addChild(this.hero);
    this.addChild(this.exit);
    this.colorFilter = new PIXI.ColorFilter();
    this.colorFilter.intensity = this.intensityTarget;
    this.colorFilter.r = this.rTarget;
    this.colorFilter.g = this.gTarget;
    this.colorFilter.b = this.bTarget;
    this.filters = [this.colorFilter];
    document.body.addEventListener('keydown', this.onKeydown);
    document.body.addEventListener('keyup', this.onKeyup);
    return;
  }

  ArrowsScene.prototype.onKeydown = function(e) {
    if (this.isCredit) {
      if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 39) {
        $('.credit').removeClass('activate');
        this.isCredit = false;
      }
    }
    switch (e.keyCode) {
      case 38:
        this.top = true;
        break;
      case 40:
        this.bottom = true;
        break;
      case 37:
        this.left = true;
        break;
      case 39:
        this.right = true;
    }
  };

  ArrowsScene.prototype.onKeyup = function(e) {
    switch (e.keyCode) {
      case 38:
        this.top = false;
        break;
      case 40:
        this.bottom = false;
        break;
      case 37:
        this.left = false;
        break;
      case 39:
        this.right = false;
    }
  };

  ArrowsScene.prototype.resize = function() {
    this.background.resize();
  };

  ArrowsScene.prototype.update = function(dt) {
    var distance, dx, dy, i, rotation, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
    this.hero.update(dt);
    this.ax = 0;
    this.ay = 0;
    if (this.left) {
      this.ax -= 1;
    }
    if (this.right) {
      this.ax += 1;
    }
    if (this.top) {
      this.ay -= 1;
    }
    if (this.bottom) {
      this.ay += 1;
    }
    this.vx += this.ax;
    this.vy += this.ay;
    this.vx *= .95;
    this.vy *= .95;
    if (this.vx > this.maxSpeed) {
      this.vx = this.maxSpeed;
    } else if (this.vx < -this.maxSpeed) {
      this.vx = -this.maxSpeed;
    }
    if (this.vy > this.maxSpeed) {
      this.vy = this.maxSpeed;
    } else if (this.vy < -this.maxSpeed) {
      this.vy = -this.maxSpeed;
    }
    this.hero.position.x += this.vx;
    this.hero.position.y += this.vy;
    this.hero.rotation = Math.atan2(this.vy, this.vx) + Constant.MPI2;
    this.exit.update(dt);
    this.position.x = -this.hero.position.x + window.innerWidth / 2;
    this.position.y = -this.hero.position.y + window.innerHeight / 2;
    this.background.position.x = this.hero.position.x - Math.ceil(window.innerWidth / 2);
    this.background.position.y = this.hero.position.y - Math.ceil(window.innerHeight / 2);
    dx = this.exit.position.x - this.hero.position.x;
    dy = this.exit.position.y - this.hero.position.y;
    rotation = Math.atan2(dy, dx) - Constant.MPI2;
    this.colorFilter.intensity += (this.intensityTarget - this.colorFilter.intensity) * 0.05;
    this.colorFilter.r += (this.rTarget - this.colorFilter.r) * 0.05;
    this.colorFilter.g += (this.gTarget - this.colorFilter.g) * 0.05;
    this.colorFilter.b += (this.bTarget - this.colorFilter.b) * 0.05;
    for (i = _i = _ref = this.arrows.length - 1; _i >= 0; i = _i += -1) {
      if (!this.arrows[i].destroying) {
        this.arrows[i].lookAt(this.exit.position.x, this.exit.position.y);
      }
      this.arrows[i].update(dt);
    }
    distance = Math2d.distanceSqrt(this.hero.position, this.exit.position);
    if (distance < 70) {
      this.levelUp();
    }
    if (this.level === 7 || this.level === 8) {
      GlobulManager.update(dt, this, rotation, this.hero, this.exit, distance, this.level === 8);
    }
    if (this.level === 9 || this.level === 10) {
      StarManager.update(dt, this, rotation, this.hero, this.exit, distance, false);
    }
    for (i = _j = _ref1 = this.triangles.length - 1; _j >= 0; i = _j += -1) {
      this.triangles[i].update(dt, this.exit);
    }
    for (i = _k = _ref2 = this.starsEmitters.length - 1; _k >= 0; i = _k += -1) {
      this.starsEmitters[i].update(dt);
    }
    for (i = _l = _ref3 = this.observers.length - 1; _l >= 0; i = _l += -1) {
      this.observers[i].update(dt);
    }
    this.background.update(dt);
  };

  ArrowsScene.prototype.levelUp = function() {
    var a, e, i, jizz, o, x, y, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _s, _t, _u, _v;
    this.level++;
    this.exit.destroy();
    for (i = _i = _ref = this.observers.length - 1; _i >= 0; i = _i += -1) {
      if (this.observers[i].target === this.exit) {
        this.observers[i].dispose();
      }
    }
    this.exit = new Exit();
    this.addChild(this.exit);
    for (i = _j = 0, _ref1 = this.arrows.length; _j < _ref1; i = _j += 1) {
      if (!this.arrows[i].destroying) {
        this.arrows[i].destroy();
      }
    }
    for (i = _k = 0, _ref2 = this.triangles.length; _k < _ref2; i = _k += 1) {
      if (!this.triangles[i].destroying) {
        this.triangles[i].destroy();
      }
    }
    if (this.level < 7 || this.level > 16 && this.level < 19) {
      jizz = 400;
      for (x = _l = 0; _l < 20; x = _l += 1) {
        for (y = _m = 0; _m < 20; y = _m += 1) {
          a = new AnimatedArrow();
          a.position.x = x * 600 + jizz * Math.random() - jizz / 2;
          a.position.y = y * 600 + jizz * Math.random() - jizz / 2;
          this.addChild(a);
          this.arrows.push(a);
        }
      }
    }
    if (this.level >= 11 && this.level <= 16) {
      jizz = 200;
      for (x = _n = 0; _n < 30; x = _n += 1) {
        for (y = _o = 0; _o < 30; y = _o += 1) {
          a = new Triangle();
          a.position.x = x * 400 + jizz * Math.random() - jizz / 2;
          a.position.y = y * 400 + jizz * Math.random() - jizz / 2;
          this.addChild(a);
          this.triangles.push(a);
        }
      }
    }
    switch (this.level) {
      case 1:
        this.hero.addEye();
        this.exit.position.x = 300;
        this.exit.position.y = 3000;
        this.rTarget = 1;
        this.intensityTarget = .6;
        this.hero.grow();
        break;
      case 2:
        this.hero.addBear();
        this.hero.grow();
        this.bTarget = .3;
        this.intensityTarget = .4;
        this.exit.position.x = 1500;
        this.exit.position.y = 500;
        this.filter = [new PIXI.InvertFilter(1), new PIXI.ColorMatrixFilter([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])];
        break;
      case 3:
        this.hero.addArms();
        this.hero.grow();
        this.gTarget = .7;
        this.intensityTarget = .45;
        this.exit.position.x = 2000;
        this.exit.position.y = 4000;
        break;
      case 4:
        this.gTarget = .2;
        this.rTarget = .1;
        this.bTarget = .7;
        this.hero.grow();
        this.hero.addArms();
        this.intensityTarget = .5;
        this.exit.position.x = 4000;
        this.exit.position.y = 4500;
        break;
      case 5:
        this.hero.small();
        this.hero.addArms();
        this.gTarget = .2;
        this.rTarget = .4;
        this.bTarget = .1;
        this.exit.position.x = 6000;
        this.exit.position.y = 6000;
        this.intensityTarget = .2;
        break;
      case 6:
        this.hero.small();
        this.hero.addArms();
        this.gTarget = .7;
        this.rTarget = .7;
        this.bTarget = .2;
        this.exit.position.x = 3000;
        this.exit.position.y = 6500;
        this.intensityTarget = .3;
        break;
      case 7:
        this.hero.small();
        this.hero.addBear();
        this.hero.addBear();
        this.hero.addBear();
        this.hero.addBear();
        this.hero.removeArms();
        this.gTarget = .2;
        this.rTarget = .9;
        this.bTarget = .1;
        this.exit.position.x = 1000;
        this.exit.position.y = 1000;
        this.intensityTarget = .6;
        break;
      case 8:
        this.hero.grow();
        this.hero.addBear();
        this.hero.addBear();
        this.intensityTarget = .7;
        this.exit.position.x = 6000;
        this.exit.position.y = 2000;
        break;
      case 9:
        this.hero.small();
        this.hero.addBear();
        this.hero.addBear();
        this.gTarget = .12;
        this.rTarget = .12;
        this.bTarget = .5;
        this.intensityTarget = .5;
        this.exit.position.x = 4000;
        this.exit.position.y = 4000;
        e = new StarArrowEmitter(this.exit, 150, .6);
        this.addChild(e);
        this.starsEmitters.push(e);
        e = new StarArrowEmitter(this.exit, 1300, 7);
        this.addChild(e);
        this.starsEmitters.push(e);
        break;
      case 10:
        this.gTarget = .12;
        this.rTarget = .12;
        this.bTarget = .5;
        this.intensityTarget = .6;
        this.exit.position.x = 6000;
        this.exit.position.y = 2000;
        for (i = _p = _ref3 = this.starsEmitters.length - 1; _p >= 0; i = _p += -1) {
          this.starsEmitters[i].dispose();
        }
        e = new StarArrowEmitter(this.hero, 100, .4);
        this.addChild(e);
        this.starsEmitters.push(e);
        e = new StarArrowEmitter(this.exit, 150, .6);
        this.addChild(e);
        this.starsEmitters.push(e);
        e = new StarArrowEmitter(this.exit, 1300, 7);
        this.addChild(e);
        this.starsEmitters.push(e);
        break;
      case 11:
        this.hero.morphToSquare();
        this.hero.grow();
        this.gTarget = .7;
        this.rTarget = .7;
        this.bTarget = .1;
        this.intensityTarget = .55;
        this.exit.position.x = 500;
        this.exit.position.y = 1000;
        for (i = _q = _ref4 = this.starsEmitters.length - 1; _q >= 0; i = _q += -1) {
          this.starsEmitters[i].dispose();
        }
        break;
      case 12:
        this.gTarget = .4;
        this.rTarget = .7;
        this.bTarget = .2;
        this.hero.addBear();
        this.intensityTarget = .5;
        this.exit.position.x = 2000;
        this.exit.position.y = 1000;
        break;
      case 13:
        this.gTarget = .8;
        this.rTarget = .5;
        this.bTarget = .3;
        this.hero.addTentacle();
        this.hero.addBear();
        this.intensityTarget = .45;
        this.exit.position.x = 3500;
        this.exit.position.y = 4000;
        break;
      case 14:
        this.hero.addBear();
        this.hero.addBear();
        this.hero.addMiniEye();
        this.hero.addMiniEye();
        this.hero.addMiniEye();
        this.intensityTarget = .4;
        this.gTarget = .7;
        this.rTarget = .9;
        this.bTarget = .5;
        this.exit.position.x = 4900;
        this.exit.position.y = 6000;
        o = new Observer(this.exit);
        this.observers.push(o);
        this.addChild(o);
        break;
      case 15:
        this.gTarget = .7;
        this.rTarget = .9;
        this.bTarget = .5;
        this.hero.addMiniEye();
        this.hero.addMiniEye();
        this.intensityTarget = .35;
        this.exit.position.x = 3500;
        this.exit.position.y = 2500;
        o = new Observer(this.hero);
        this.observers.push(o);
        this.addChild(o);
        for (i = _r = 0; _r <= 10; i = _r += 1) {
          o = new Observer(this.exit);
          this.observers.push(o);
          this.addChild(o);
        }
        break;
      case 16:
        this.hero.addMiniEye();
        this.hero.addMiniEye();
        this.hero.addMiniEye();
        this.hero.addArms();
        this.hero.small();
        for (i = _s = 0; _s <= 3; i = _s += 1) {
          o = new Observer(this.hero);
          this.observers.push(o);
          this.addChild(o);
        }
        for (i = _t = 0; _t <= 15; i = _t += 1) {
          o = new Observer(this.exit);
          this.observers.push(o);
          this.addChild(o);
        }
        this.intensityTarget = .3;
        this.exit.position.x = 1500;
        this.exit.position.y = 5000;
        break;
      case 17:
        for (i = _u = 0; _u <= 4; i = _u += 1) {
          o = new Observer(this.hero);
          this.observers.push(o);
          this.addChild(o);
        }
        this.hero.addMiniEye();
        this.hero.addArms();
        this.hero.addMiniEye();
        o = new Observer(this.hero);
        this.observers.push(o);
        this.addChild(o);
        o = new Observer(this.hero);
        this.observers.push(o);
        this.addChild(o);
        this.gTarget = .1;
        this.rTarget = .2;
        this.bTarget = .1;
        this.intensityTarget = .1;
        this.exit.position.x = 5500;
        this.exit.position.y = 1500;
        break;
      case 18:
        this.gTarget = .8;
        this.rTarget = .8;
        this.bTarget = .8;
        for (i = _v = _ref5 = this.observers.length - 1; _v >= 0; i = _v += -1) {
          this.observers[i].dispose();
        }
        this.hero.morphToAngel();
        this.hero.small();
        this.intensityTarget = .6;
        this.exit.position.x = 2500;
        this.exit.position.y = 2500;
        break;
      case 19:
        $('.credit').addClass('activate');
        this.hero.morphToPoint();
        this.hero.small();
        this.exit.position.x = 3500;
        this.exit.position.y = 1500;
        this.level = 0;
        this.levelUp();
        break;
    }
  };

  return ArrowsScene;

})(Scene);

StarArrowEmitter = (function(_super) {
  __extends(StarArrowEmitter, _super);

  StarArrowEmitter.prototype.target = null;

  StarArrowEmitter.prototype.time = 0;

  StarArrowEmitter.prototype.tick = 700;

  StarArrowEmitter.prototype.startTime = 0.0;

  StarArrowEmitter.prototype.power = 300;

  StarArrowEmitter.prototype.angle = 0.0;

  StarArrowEmitter.prototype.destroying = false;

  function StarArrowEmitter(target, tick, power) {
    this.target = target;
    this.tick = tick != null ? tick : 700;
    this.power = power;
    StarArrowEmitter.__super__.constructor.call(this);
    this.pivot.x = .5;
    this.pivot.y = .5;
    this.alpha = .3;
    this.startTime = 600 + Math.floor(Math.random() * 200);
    return;
  }

  StarArrowEmitter.prototype.update = function(dt) {
    var a, angle, i, steps, vx, vy, _i;
    this.position.x = this.target.position.x;
    this.position.y = this.target.position.y;
    if (this.started && !this.destroying) {
      this.time += dt;
      if (this.time > this.tick) {
        this.time -= this.tick;
        this.angle += .2;
        angle = this.angle;
        steps = Constant.M2PI / 10;
        for (i = _i = 0; _i < 10; i = _i += 1) {
          angle += steps;
          vx = Math.cos(angle) * this.power;
          vy = Math.sin(angle) * this.power;
          a = StarArrow.pool.checkOut();
          a.show(vx, vy);
          this.addChild(a);
        }
      }
    }
    if (!this.started) {
      this.time += dt;
      if (this.time > this.startTime) {
        this.started = true;
        this.time = 0;
      }
    }
  };

  StarArrowEmitter.prototype.dispose = function() {
    if (this.destroying) {
      return;
    }
    this.destroying = true;
    TweenLite.to(this, .5, {
      alpha: 0
    });
    TweenLite.to(this.scale, .5, {
      x: 4,
      y: 4,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          var idx;
          idx = _this.parent.starsEmitters.indexOf(_this);
          _this.parent.starsEmitters.splice(idx, 1);
          return _this.parent.removeChild(_this);
        };
      })(this)
    });
  };

  return StarArrowEmitter;

})(PIXI.DisplayObjectContainer);

StarArrow = (function(_super) {
  __extends(StarArrow, _super);

  StarArrow.prototype.vx = 0.0;

  StarArrow.prototype.vy = 1.0;

  StarArrow.pool = null;

  StarArrow.poolInit = function() {
    return StarArrow.pool = new ObjectPool(function() {
      return new StarArrow();
    }, 100, 1000);
  };

  function StarArrow(vx, vy) {
    this.dispose = __bind(this.dispose, this);
    this.initValue = __bind(this.initValue, this);
    StarArrow.__super__.constructor.call(this, PIXI.Texture.fromFrame('arrow.png'));
    return;
  }

  StarArrow.prototype.show = function(vx, vy) {
    this.initValue();
    this.scale.x = .3;
    this.scale.y = .3;
    this.vx = vx;
    this.vy = vy;
    this.rotation = Math.atan2(this.vy, this.vx) - Constant.MPI2;
    TweenLite.to(this, .2, {
      alpha: 1
    });
    TweenLite.to(this.position, 1, {
      x: vx * 80,
      y: vy * 80
    });
    TweenLite.to(this.scale, 1, {
      x: 1,
      y: 1
    });
    TweenLite.to(this, .2, {
      delay: .8,
      alpha: 0,
      onComplete: this.dispose
    });
  };

  StarArrow.prototype.initValue = function() {
    this.rotation = 0;
    this.alpha = 0;
    this.position.y = 0;
    this.position.x = 0;
    this.scale.x = 1.0;
    this.scale.y = 1.0;
  };

  StarArrow.prototype.dispose = function() {
    this.parent.removeChild(this);
    StarArrow.pool.checkIn(this);
  };

  return StarArrow;

})(PIXI.Sprite);

AnimatedArrow = (function(_super) {
  __extends(AnimatedArrow, _super);

  AnimatedArrow.prototype.time = 0;

  AnimatedArrow.prototype.tick = 350;

  AnimatedArrow.prototype.arrows = null;

  AnimatedArrow.started = null;

  AnimatedArrow.prototype.destroying = false;

  AnimatedArrow.prototype.startTime = 0.0;

  function AnimatedArrow() {
    AnimatedArrow.__super__.constructor.call(this);
    this.pivot.x = .5;
    this.pivot.y = .5;
    this.arrows = [];
    this.startTime = 600 + Math.floor(Math.random() * 200);
    return;
  }

  AnimatedArrow.prototype.update = function(dt) {
    var a, i, _i, _ref;
    if (!this.destroying && this.started) {
      this.time += dt;
      if (this.time > this.tick) {
        this.time -= this.tick;
        a = Arrow.pool.checkOut();
        a.show();
        this.addChild(a);
        this.arrows.push(a);
      }
    }
    if (!this.started) {
      this.time += dt;
      if (this.time > this.startTime) {
        this.started = true;
        this.time = 0;
      }
    }
    for (i = _i = _ref = this.arrows.length - 1; _i >= 0; i = _i += -1) {
      this.arrows[i].update(dt);
    }
  };

  AnimatedArrow.prototype.destroy = function() {
    var i, x, y, _i, _ref;
    this.destroying = true;
    for (i = _i = _ref = this.arrows.length - 1; _i >= 0; i = _i += -1) {
      this.angle = (Constant.M2PI * .3 - .15) * ((i + 1) / this.arrows.length);
      x = Math.cos(this.angle) * 6;
      y = Math.sin(this.angle) * 3;
      this.arrows[i].destroy(x, y);
    }
  };

  AnimatedArrow.prototype.lookAt = function(x, y) {
    var dx, dy;
    dx = x - this.position.x;
    dy = y - this.position.y;
    this.rotation = Math.atan2(dy, dx) - Constant.MPI2;
  };

  AnimatedArrow.prototype.remove = function(a) {
    var idx;
    this.arrows.splice(this.arrows.indexOf(a), 1);
    this.removeChild(a);
    Arrow.pool.checkIn(a);
    if (this.destroying && this.arrows.length === 0) {
      idx = this.parent.arrows.indexOf(this);
      this.parent.arrows.splice(idx, 1);
      this.parent.removeChild(this);
    }
  };

  return AnimatedArrow;

})(PIXI.DisplayObjectContainer);

Arrow = (function(_super) {
  __extends(Arrow, _super);

  Arrow.prototype.hidding = false;

  Arrow.prototype.destroying = false;

  Arrow.prototype.vx = 0.0;

  Arrow.prototype.vy = 1.0;

  Arrow.pool = null;

  Arrow.poolInit = function() {
    return Arrow.pool = new ObjectPool(function() {
      return new Arrow();
    }, 100, 1000);
  };

  function Arrow() {
    this.dispose = __bind(this.dispose, this);
    this.initValue = __bind(this.initValue, this);
    Arrow.__super__.constructor.call(this, PIXI.Texture.fromFrame('arrow.png'));
    return;
  }

  Arrow.prototype.show = function() {
    this.initValue();
    TweenLite.to(this, .7, {
      alpha: 1
    });
  };

  Arrow.prototype.destroy = function(vx, vy) {
    TweenLite.killTweensOf(this);
    this.destroying = true;
    this.vx = vx;
    this.vy = vy;
  };

  Arrow.prototype.update = function(dt) {
    var speed;
    speed = Math.ceil(dt / 16);
    this.position.y += speed * this.vy;
    this.position.x += speed * this.vx;
    if (this.destroying) {
      this.rotation = Math.atan2(this.vy, this.vx) - Constant.MPI2;
      this.alpha -= speed * 0.007;
      if (this.alpha <= 0.02) {
        this.dispose();
      }
      return;
    } else if (!this.hidding && this.position.y > 300) {
      this.hidding = true;
      TweenLite.to(this.scale, .3, {
        x: 0.8,
        y: 0.8
      });
      TweenLite.to(this, .3, {
        alpha: 0,
        onComplete: this.dispose
      });
    }
  };

  Arrow.prototype.initValue = function() {
    this.hidding = false;
    this.destroying = false;
    this.rotation = 0;
    this.alpha = 0;
    this.position.y = 0;
    this.position.x = 0;
    this.scale.x = 1.0;
    this.scale.y = 1.0;
    this.vx = 0.0;
    this.vy = 3.0;
  };

  Arrow.prototype.dispose = function() {
    this.initValue();
    this.parent.remove(this);
  };

  return Arrow;

})(PIXI.Sprite);

BG = (function(_super) {
  __extends(BG, _super);

  function BG() {
    BG.__super__.constructor.call(this);
    this.alpha = 0;
    this.noiseFilter = new PIXI.NoiseFilter();
    this.noiseFilter.intensity = -.2;
    this.filters = [this.noiseFilter];
    this.resize();
    TweenLite.to(this, 2, {
      alpha: .1
    });
    return;
  }

  BG.prototype.resize = function() {
    this.clear();
    this.beginFill(0xCCCCCC);
    this.drawRect(0, 0, Math.ceil(window.innerWidth), Math.ceil(window.innerHeight));
    this.endFill();
  };

  BG.prototype.update = function(dt) {
    this.noiseFilter.time += dt * 0.01;
  };

  return BG;

})(PIXI.Graphics);

Hero = (function(_super) {
  __extends(Hero, _super);

  Hero.prototype.currentForm = null;

  Hero.prototype.bears = null;

  Hero.prototype.lefts = null;

  Hero.prototype.eyes = null;

  Hero.prototype.rights = null;

  Hero.prototype.time = 0;

  function Hero() {
    Hero.__super__.constructor.call(this);
    this.bears = [];
    this.lefts = [];
    this.rightsWing = [];
    this.leftsWing = [];
    this.eyes = [];
    this.rights = [];
    this.scale.x = 0.2;
    this.scale.y = 0.2;
    this.morphToPoint();
    return;
  }

  Hero.prototype.getPointForm = function(radius) {
    var g;
    g = new PIXI.Graphics();
    g.clear();
    g.beginFill(0xFFFFFF, 1);
    g.drawCircle(0, 0, radius);
    g.endFill();
    return g;
  };

  Hero.prototype.morphToPoint = function() {
    this.removeForm();
    this.currentForm = this.getPointForm(10);
    this.addChild(this.currentForm);
  };

  Hero.prototype.morphToSquare = function() {
    var base, puppils;
    this.removeForm();
    this.isSquare = true;
    base = new PIXI.Sprite(PIXI.Texture.fromFrame('heroS-bg.png'));
    base.pivot.x = base.width / 2;
    base.pivot.y = base.height / 2;
    TweenLite.from(base.scale, 1.1, {
      x: 0,
      y: 0,
      ease: Back.easeOut
    });
    this.addChild(base);
    puppils = new PIXI.Sprite(PIXI.Texture.fromFrame('eyeSquare.png'));
    puppils.pivot.x = puppils.width / 2;
    puppils.pivot.y = puppils.height / 2;
    TweenLite.from(puppils.scale, 1.1, {
      x: 0,
      y: 0,
      ease: Back.easeOut
    });
    this.addChild(puppils);
  };

  Hero.prototype.morphToAngel = function() {
    var angle, left, right;
    this.removeForm();
    this.addEye();
    right = new PIXI.Sprite(PIXI.Texture.fromFrame('wings.png'));
    right.pivot.x = 53;
    right.pivot.y = 101;
    angle = this.rights.length * .4 - .2;
    right.position.x = 110;
    right.position.y = 0;
    this.rightsWing.push(right);
    TweenLite.from(right.scale, 1.1, {
      x: 0,
      y: 0,
      ease: Back.easeOut
    });
    this.addChild(right);
    left = new PIXI.Sprite(PIXI.Texture.fromFrame('wingsLeft.png'));
    left.pivot.x = 144;
    left.pivot.y = 101;
    angle = this.lefts.length * .4 - .2;
    left.position.x = -110;
    left.position.y = 0;
    this.leftsWing.push(left);
    TweenLite.from(left.scale, 1.1, {
      x: 0,
      y: 0,
      ease: Back.easeOut
    });
    this.addChild(left);
  };

  Hero.prototype.addTentacle = function() {
    var tentacle;
    tentacle = new PIXI.Sprite(PIXI.Texture.fromFrame('heroS-tentacles.png'));
    tentacle.pivot.x = 95;
    tentacle.pivot.y = 0;
    tentacle.scale.x = 0;
    tentacle.scale.y = 0;
    tentacle.position.x = 30;
    tentacle.position.y = 20;
    TweenLite.to(tentacle.scale, 1.1, {
      x: 1,
      y: 1,
      ease: Quad.easeOut
    });
    this.tentacle = tentacle;
    this.addChild(tentacle);
  };

  Hero.prototype.addMiniEye = function() {
    var angle, e, eye, i, radius, steps, x, y, _i, _ref;
    eye = new PIXI.Sprite(PIXI.Texture.fromFrame('eyeSquare.png'));
    eye.pivot.x = eye.width / 2;
    eye.pivot.y = eye.height / 2;
    eye.scale.x = 0;
    eye.scale.y = 0;
    eye.rotation = Constant.M2PI * Math.random();
    radius = 50 + Math.random() * 30;
    angle = Constant.M2PI * Math.random();
    eye.position.x = Math.cos(angle) * radius;
    eye.position.y = Math.sin(angle) * radius;
    this.eyes.push(eye);
    TweenLite.to(eye.scale, 1.1, {
      x: .5,
      y: .5,
      ease: Quad.easeOut
    });
    this.addChild(eye);
    angle = -Constant.MPI2;
    steps = Constant.M2PI / this.eyes.length;
    radius = 60 + Math.random() * 50;
    for (i = _i = 0, _ref = this.eyes.length; _i < _ref; i = _i += 1) {
      angle += steps;
      e = this.eyes[i];
      TweenLite.to(e, .5, {
        rotation: Constant.M2PI * Math.random()
      });
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      TweenLite.to(e.position, .5, {
        x: x,
        y: y
      });
    }
  };

  Hero.prototype.addEye = function() {
    var eye, puppils;
    this.removeForm();
    eye = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-bg.png'));
    eye.pivot.x = eye.width / 2;
    eye.pivot.y = eye.height / 2;
    TweenLite.from(eye.scale, 1.1, {
      x: 0,
      y: 0,
      ease: Back.easeOut
    });
    this.addChild(eye);
    puppils = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-pupils.png'));
    puppils.position.y = -30;
    puppils.pivot.x = puppils.width / 2;
    puppils.pivot.y = puppils.height / 2;
    TweenLite.from(puppils.scale, 1.1, {
      x: 0,
      y: 0,
      ease: Back.easeOut
    });
    this.addChild(puppils);
  };

  Hero.prototype.addBear = function() {
    var bear;
    if (this.isSquare) {
      bear = new PIXI.Sprite(PIXI.Texture.fromFrame('bearSquare.png'));
    } else {
      bear = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-bear.png'));
    }
    bear.pivot.x = bear.width / 2;
    bear.pivot.y = bear.height / 2;
    bear.scale.x = 0;
    bear.scale.y = 0;
    bear.alpha = 1 / (this.bears.length + 1);
    TweenLite.to(bear.scale, 1.1, {
      x: 1 + this.bears.length * .25,
      y: 1 + this.bears.length * .25,
      ease: Quad.easeOut
    });
    this.bears.push(bear);
    return this.addChildAt(bear, 0);
  };

  Hero.prototype.addArms = function() {
    var angle, left, right;
    left = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-leftarms.png'));
    left.pivot.x = 9;
    left.pivot.y = 125;
    angle = this.lefts.length * .4 - .2;
    left.position.x = Math.cos(angle) * 98;
    left.position.y = Math.sin(angle) * 98;
    this.lefts.push(left);
    TweenLite.from(left.scale, 1.1, {
      x: 0,
      y: 0,
      ease: Back.easeOut
    });
    this.addChild(left);
    right = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-rightarms.png'));
    right.pivot.x = 66;
    right.position.x = -98;
    right.pivot.y = 125;
    angle = this.rights.length * .4 - .2;
    right.position.x = -Math.cos(angle) * 98;
    right.position.y = Math.sin(angle) * 98;
    this.rights.push(right);
    TweenLite.from(right.scale, 1.1, {
      x: 0,
      y: 0,
      ease: Back.easeOut
    });
    return this.addChild(right);
  };

  Hero.prototype.removeArms = function() {
    var i, l, r, scope, _fn, _i, _ref;
    _fn = function(l, r, scope) {
      TweenLite.to(l.scale, .4, {
        delay: i * 0.05,
        x: 0,
        y: 0,
        ease: Expo.easeOut,
        onComplete: function() {
          return scope.removeChild(l);
        }
      });
      return TweenLite.to(r.scale, .4, {
        delay: i * 0.05 + 0.02,
        x: 0,
        y: 0,
        ease: Expo.easeOut,
        onComplete: function() {
          return scope.removeChild(r);
        }
      });
    };
    for (i = _i = 0, _ref = this.lefts.length; _i < _ref; i = _i += 1) {
      l = this.lefts[i];
      r = this.rights[i];
      scope = this;
      _fn(l, r, scope);
    }
    this.lefts = [];
    this.rights = [];
  };

  Hero.prototype.update = function(dt) {
    var i, l, _i, _j, _k, _ref, _results;
    this.time += dt;
    if (this.tentacle) {
      this.tentacle.rotation = Math.sin(this.time / 400) * .2 - .1;
    }
    for (i = _i = 0, _ref = this.bears.length; _i < _ref; i = _i += 1) {
      this.bears[i].rotation = Math.random() * Constant.M2PI;
    }
    l = this.lefts.length;
    for (i = _j = 0; _j < l; i = _j += 1) {
      this.lefts[i].rotation = Math.sin(this.time / 100 + ((i + 1) / l)) * .3;
      this.rights[i].rotation = -Math.sin(this.time / 100 + ((i + 1) / l)) * .3;
    }
    l = this.rightsWing.length;
    _results = [];
    for (i = _k = 0; _k < l; i = _k += 1) {
      this.leftsWing[i].rotation = -Math.sin(this.time / 100 + ((i + 1) / l)) * .3 - .75;
      _results.push(this.rightsWing[i].rotation = Math.sin(this.time / 100 + ((i + 1) / l)) * .3 + .75);
    }
    return _results;
  };

  Hero.prototype.removeForm = function() {
    var c, i, scope, _fn, _i, _ref;
    this.bears = [];
    this.eyes = [];
    this.lefts = [];
    this.rights = [];
    this.tentacle = null;
    this.isSquare = false;
    if (this.currentForm === null) {
      if (this.children.length >= 0) {
        _fn = function(c, scope) {
          return TweenLite.to(c.scale, .5, {
            x: 0,
            y: 0,
            onComplete: function() {
              return scope.removeChild(c);
            }
          });
        };
        for (i = _i = _ref = this.children.length - 1; _i >= 0; i = _i += -1) {
          c = this.children[i];
          scope = this;
          _fn(c, scope);
        }
      }
      return;
    } else {
      c = this.currentForm;
      TweenLite.to(this.currentForm.scale, .5, {
        x: 0,
        y: 0,
        onComplete: (function(_this) {
          return function() {
            return _this.removeChild(c);
          };
        })(this)
      });
      this.currentForm = null;
    }
  };

  Hero.prototype.grow = function() {
    TweenLite.to(this.scale, 1.2, {
      x: this.scale.x + .2,
      y: this.scale.y + .2,
      ease: Back.easeOut
    });
  };

  Hero.prototype.small = function() {
    TweenLite.to(this.scale, 1.2, {
      x: this.scale.y - .2,
      y: this.scale.x - .2,
      ease: Back.easeOut
    });
  };

  return Hero;

})(PIXI.DisplayObjectContainer);

Exit = (function(_super) {
  __extends(Exit, _super);

  Exit.prototype.time = 0;

  Exit.prototype.tick = 750;

  Exit.prototype.points = null;

  Exit.prototype.destroying = false;

  function Exit() {
    this.dispose = __bind(this.dispose, this);
    Exit.__super__.constructor.call(this);
    this.pivot.x = .5;
    this.pivot.y = .5;
    this.points = [];
    return;
  }

  Exit.prototype.update = function(dt) {
    var a;
    if (this.destroying) {
      return;
    }
    this.time += dt;
    if (this.time > this.tick) {
      this.time -= this.tick;
      a = ExitPoint.pool.checkOut();
      a.show();
      this.addChild(a);
      this.points.push(a);
    }
  };

  Exit.prototype.remove = function(a) {
    this.points.splice(0, 1);
    this.removeChild(a);
    ExitPoint.pool.checkIn(a);
  };

  Exit.prototype.destroy = function() {
    this.destroying = true;
    TweenLite.to(this, 1.4, {
      alpha: 0
    });
    TweenLite.to(this.scale, 1.4, {
      ease: Expo.easeIn,
      x: 10,
      y: 10,
      onComplete: this.dispose
    });
  };

  Exit.prototype.dispose = function() {
    this.parent.removeChild(this);
  };

  return Exit;

})(PIXI.DisplayObjectContainer);

ExitPoint = (function(_super) {
  __extends(ExitPoint, _super);

  ExitPoint.pool = null;

  ExitPoint.poolInit = function() {
    return ExitPoint.pool = new ObjectPool(function() {
      return new ExitPoint();
    }, 20, 100);
  };

  function ExitPoint() {
    this.dispose = __bind(this.dispose, this);
    ExitPoint.__super__.constructor.call(this);
    this.draw();
    this.scale.x = 0;
    this.scale.y = 0;
    return;
  }

  ExitPoint.prototype.show = function() {
    this.alpha = 1;
    TweenLite.to(this.scale, 1.6, {
      x: 1,
      y: 1,
      ease: Quad.easeOut,
      onComplete: this.dispose
    });
    TweenLite.to(this, 1.6, {
      alpha: 0,
      ease: Quad.easeOut
    });
  };

  ExitPoint.prototype.dispose = function() {
    this.parent.remove(this);
    this.scale.x = 0;
    this.scale.y = 0;
    this.alpha = 1;
  };

  ExitPoint.prototype.draw = function() {
    this.clear();
    this.beginFill(0xFFFFFF, 1);
    this.drawCircle(0, 0, 70);
    this.endFill();
  };

  return ExitPoint;

})(PIXI.Graphics);

GlobulManager = (function() {
  function GlobulManager() {}

  GlobulManager.time = 0;

  GlobulManager.tick = 75;

  GlobulManager.update = function(dt, stage, angle, hero, exit, distance, move) {
    var dist, g;
    this.time += dt;
    if (this.time > this.tick) {
      this.time -= this.tick;
      g = new Globul();
      stage.addChild(g);
      if (distance > 300) {
        dist = 100 + 500 * Math.random();
        angle += Math.random() * .2 - .1 + Constant.MPI2;
        if (!move) {
          g.position.x = hero.position.x + Math.cos(angle) * dist;
          g.position.y = hero.position.y + Math.sin(angle) * dist;
        } else {
          g.position.x = exit.position.x;
          g.position.y = exit.position.y;
          TweenLite.to(g, .8, {
            ease: Quad.easeOut,
            x: hero.position.x,
            y: hero.position.y
          });
        }
      } else {
        dist = 300 * Math.random();
        angle = Math.random() * Constant.M2PI;
        g.position.x = exit.position.x + Math.cos(angle) * dist;
        g.position.y = exit.position.y + Math.sin(angle) * dist;
      }
    }
  };

  return GlobulManager;

})();

Globul = (function(_super) {
  __extends(Globul, _super);

  function Globul() {
    this.dispose = __bind(this.dispose, this);
    var r, texture;
    r = Math.floor(Math.random() * 4);
    texture = PIXI.Texture.fromFrame('globul' + r + '.png');
    Globul.__super__.constructor.call(this, texture);
    this.alpha = 0;
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    this.scale.x = .2;
    this.scale.y = .2;
    this.rotation = Constant.M2PI * Math.random() * 4;
    TweenLite.to(this, .2, {
      alpha: 1
    });
    TweenLite.to(this, .4, {
      delay: .4,
      alpha: 0,
      onComplete: this.dispose
    });
    TweenLite.to(this, .8, {
      rotation: this.rotation + Math.random() * .3 - .15
    });
    TweenLite.to(this.scale, .8, {
      x: .5,
      y: .5,
      ease: Quad.easeOut
    });
    return;
  }

  Globul.prototype.dispose = function() {
    this.parent.removeChild(this);
  };

  return Globul;

})(PIXI.Sprite);

Triangle = (function(_super) {
  __extends(Triangle, _super);

  Triangle.prototype.time = 0;

  Triangle.prototype.destroying = false;

  function Triangle() {
    this.dispose = __bind(this.dispose, this);
    var scale, texture;
    texture = PIXI.Texture.fromFrame('indicator.png');
    Triangle.__super__.constructor.call(this, texture);
    this.time = Math.floor(Math.random() * 1000);
    this.alpha = 0;
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    this.scale.x = .2;
    this.scale.y = .2;
    TweenLite.to(this, .2, {
      alpha: 1
    });
    scale = .2 + Math.random() * .4;
    TweenLite.to(this.scale, .8, {
      x: scale,
      y: scale,
      ease: Quad.easeOut
    });
    return;
  }

  Triangle.prototype.update = function(dt, target) {
    var angle;
    this.time += dt;
    angle = Math.atan2(this.position.y - target.position.y, this.position.x - target.position.x) - Constant.MPI2;
    this.rotation = angle + Math.sin(this.time / 200) * .3;
  };

  Triangle.prototype.destroy = function() {
    var duration, x, y;
    this.destroying = true;
    x = this.position.x + Math.cos(this.rotation) * 100;
    y = this.position.y + Math.sin(this.rotation) * 100;
    duration = .5 + Math.random() * .3;
    TweenLite.to(this.position, duration, {
      x: x,
      y: y
    });
    TweenLite.to(this, duration, {
      alpha: 0,
      onComplete: this.dispose
    });
  };

  Triangle.prototype.dispose = function() {
    this.parent.triangles.splice(this.parent.triangles.indexOf(this), 1);
    this.parent.removeChild(this);
  };

  return Triangle;

})(PIXI.Sprite);

StarManager = (function() {
  function StarManager() {}

  StarManager.time = 0;

  StarManager.tick = 200;

  StarManager.update = function(dt, stage, angle, hero, exit, distance, move) {
    var dist, g;
    this.time += dt;
    if (this.time > this.tick) {
      this.time -= this.tick;
      g = new Star();
      stage.addChild(g);
      if (distance > 300) {
        dist = 100 + 500 * Math.random();
        angle += Math.random() * .6 - .3 + Constant.MPI2;
        if (!move) {
          g.position.x = hero.position.x + Math.cos(angle) * dist;
          g.position.y = hero.position.y + Math.sin(angle) * dist;
        } else {
          g.position.x = exit.position.x;
          g.position.y = exit.position.y;
          TweenLite.to(g, .8, {
            ease: Quad.easeOut,
            x: hero.position.x,
            y: hero.position.y
          });
        }
      } else {
        dist = 300 * Math.random();
        angle = Math.random() * Constant.M2PI;
        g.position.x = exit.position.x + Math.cos(angle) * dist;
        g.position.y = exit.position.y + Math.sin(angle) * dist;
      }
    }
  };

  return StarManager;

})();

Star = (function(_super) {
  __extends(Star, _super);

  function Star() {
    this.dispose = __bind(this.dispose, this);
    var r, texture;
    r = Math.floor(Math.random() * 4);
    texture = PIXI.Texture.fromFrame('star.png');
    Star.__super__.constructor.call(this, texture);
    this.alpha = 0;
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    this.scale.x = .2;
    this.scale.y = .2;
    this.rotation = Constant.M2PI * Math.random() * 4;
    TweenLite.to(this, .2, {
      alpha: 1
    });
    TweenLite.to(this, .4, {
      delay: .4,
      alpha: 0,
      onComplete: this.dispose
    });
    TweenLite.to(this, .8, {
      rotation: this.rotation + Math.random() * .3 - .15
    });
    TweenLite.to(this.scale, .8, {
      x: .5,
      y: .5,
      ease: Quad.easeOut
    });
    return;
  }

  Star.prototype.dispose = function() {
    this.parent.removeChild(this);
  };

  return Star;

})(PIXI.Sprite);

Observer = (function(_super) {
  __extends(Observer, _super);

  Observer.prototype.angle = 0.0;

  Observer.prototype.time = 0.0;

  Observer.prototype.tick = 0.0;

  Observer.prototype.timer = 0.0;

  Observer.prototype.target = null;

  Observer.prototype.baseRadius = 200;

  Observer.prototype.destroying = false;

  function Observer(target) {
    var r, texture, time;
    this.target = target;
    this.dispose = __bind(this.dispose, this);
    time = Math.random() * 1000.0;
    r = Math.floor(Math.random() * 3);
    texture = PIXI.Texture.fromFrame('weirdEye0' + r + '.png');
    Observer.__super__.constructor.call(this, texture);
    this.alpha = 0;
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    this.scale.x = .8;
    this.scale.y = .8;
    this.rotation = Constant.M2PI * Math.random();
    this.angle = Constant.M2PI * Math.random();
    TweenLite.to(this, .5, {
      alpha: 1
    });
    TweenLite.to(this.scale, .5, {
      x: .5,
      y: .5
    });
    return;
  }

  Observer.prototype.update = function(dt) {
    var angle, dx, dy, radius;
    this.time += dt;
    radius = this.baseRadius + Math.cos(this.time / 600) * 70;
    angle = this.angle + Math.sin(this.time / 300) * .35;
    this.position.x += (this.target.position.x + Math.cos(angle) * radius - this.position.x) * .05;
    this.position.y += (this.target.position.y + Math.sin(angle) * radius - this.position.y) * .05;
    this.scale.x += Math.sin(this.time / 400) * .05 + .45 - this.scale.x;
    this.scale.y += Math.sin(this.time / 400) * .05 + .45 - this.scale.y;
    dx = this.target.position.x - this.position.x;
    dy = this.target.position.y - this.position.y;
    this.rotation += (Math.atan2(dy, dx) + Constant.MPI2 - this.rotation) * 0.15;
  };

  Observer.prototype.dispose = function() {
    if (!this.destroying) {
      this.destroying = true;
      TweenLite.to(this, .5, {
        alpha: 0,
        onComplete: (function(_this) {
          return function() {
            var idx;
            idx = _this.parent.observers.indexOf(_this);
            _this.parent.observers.splice(idx, 1);
            return _this.parent.removeChild(_this);
          };
        })(this)
      });
    }
  };

  return Observer;

})(PIXI.Sprite);
