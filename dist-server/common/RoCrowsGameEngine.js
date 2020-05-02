"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _Aviary = _interopRequireDefault(require("./Aviary"));

var _Crow = _interopRequireDefault(require("./Crow"));

var _Robot = _interopRequireDefault(require("./Robot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RoCrowsGameEngine = /*#__PURE__*/function (_GameEngine) {
  _inherits(RoCrowsGameEngine, _GameEngine);

  var _super = _createSuper(RoCrowsGameEngine);

  function RoCrowsGameEngine(options) {
    var _this;

    _classCallCheck(this, RoCrowsGameEngine);

    _this = _super.call(this, options); // create physics with no friction; wrap positions after each step

    _this.physicsEngine = new _lanceGg.P2PhysicsEngine({
      gameEngine: _assertThisInitialized(_this)
    });
    _this.physicsEngine.world.defaultContactMaterial.friction = 0;

    _this.on('postStep', _this.warpAll.bind(_assertThisInitialized(_this))); //steer crows towards robots each step


    _this.on('postStep', _this.steerCrows.bind(_assertThisInitialized(_this))); // game variables


    Object.assign(_assertThisInitialized(_this), {
      /*
      lives: 3, shipSize: 0.3, shipTurnSpeed: 0.05, shipSpeed: 2, bulletRadius: 0.03, bulletLifeTime: 60,
      asteroidRadius: 0.9, numAsteroidLevels: 4, numAsteroidVerts: 6, maxAsteroidSpeed: 2,
      */
      spaceWidth: 16,
      spaceHeight: 9,
      aviaryRadius: 0.1,
      crowRadius: 0.06,
      robotSize: 0.2,
      crowSpeed: 1.5,
      robotSpeed: 0.5,
      grabDuration: 120,
      // collision groups
      ROBOT: Math.pow(2, 1),
      CROW: Math.pow(2, 2),
      AVIARY: Math.pow(2, 3)
    });
    return _this;
  } // steer the crows towards their players' robots


  _createClass(RoCrowsGameEngine, [{
    key: "steerCrows",
    value: function steerCrows() {
      var _this2 = this;

      this.world.queryObjects({
        instanceType: _Crow["default"]
      }).forEach(function (crow) {
        // find corresponding robot
        var robot = _this2.world.queryObject({
          playerId: crow.playerId,
          instanceType: _Robot["default"]
        });

        if (robot) {
          // calculate crow vector based on target robot
          var vecBearing = new _lanceGg.TwoVector();
          vecBearing.copy(robot.position);
          vecBearing.subtract(crow.position);
          var scaleFactor = _this2.crowSpeed / vecBearing.length();
          vecBearing.multiplyScalar(scaleFactor);
          crow.velocity = vecBearing;
          crow.refreshToPhysics();
        }
      });
    } // If the body is out of space bounds, warp it to the other side

  }, {
    key: "warpAll",
    value: function warpAll() {
      var _this3 = this;

      this.world.forEachObject(function (id, obj) {
        var p = obj.position;
        if (p.x > _this3.spaceWidth / 2) p.x -= _this3.spaceWidth;
        if (p.y > _this3.spaceHeight / 2) p.y -= _this3.spaceHeight;
        if (p.x < -_this3.spaceWidth / 2) p.x += _this3.spaceWidth;
        if (p.y < -_this3.spaceHeight / 2) p.y += _this3.spaceHeight;
        obj.refreshToPhysics();
      });
    }
  }, {
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Robot["default"]);
      serializer.registerClass(_Aviary["default"]);
      serializer.registerClass(_Crow["default"]);
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(RoCrowsGameEngine.prototype), "processInput", this).call(this, inputData, playerId); // handle keyboard presses
      // if immediate responses are required, they can be handled here but use extreme caution (or learn about shadow objects) if new objects will have to be created


      var playerAviary = this.world.queryObject({
        playerId: playerId,
        instanceType: _Aviary["default"]
      });

      if (playerAviary) {
        this.emit('releaseCrow', playerAviary, inputData.input);
      }
    } // returns a random number between -0.5 and 0.5

  }, {
    key: "rand",
    value: function rand() {
      return Math.random() - 0.5;
    } // create aviary

  }, {
    key: "addAviary",
    value: function addAviary(playerId) {
      var x = this.rand() * this.spaceWidth;
      var y = this.rand() * this.spaceHeight;
      var vx = 0;
      var vy = 0;
      var va = 0;
      var a = new _Aviary["default"](this, {}, {
        playerId: playerId,
        mass: 100,
        angularVelocity: va,
        position: new _lanceGg.TwoVector(x, y),
        velocity: new _lanceGg.TwoVector(vx, vy)
      });
      this.addObjectToWorld(a);
    } // create robot

  }, {
    key: "addRobot",
    value: function addRobot(playerId) {
      //find player's aviary and place robot nearby
      var playerAviaryBody = this.world.queryObject({
        playerId: playerId,
        instanceType: _Aviary["default"]
      }).physicsObj;
      var x = playerAviaryBody.position[0];
      x += this.aviaryRadius * 3 * (x > 0 ? -1 : 1);
      var y = playerAviaryBody.position[1];
      y += this.aviaryRadius * 3 * (y > 0 ? -1 : 1);
      var vx = 0;
      var vy = 0;
      var s = new _Robot["default"](this, {}, {
        playerId: playerId,
        mass: 10,
        angularVelocity: 0,
        position: new _lanceGg.TwoVector(x, y),
        velocity: new _lanceGg.TwoVector(vx, vy)
      }); //s.lives = this.lives;

      this.addObjectToWorld(s);
    }
  }, {
    key: "addCrow",
    value: function addCrow(playerAviary, key) {
      //release a crow from the aviary
      var vx = 0;
      var vy = 0;
      var crow = new _Crow["default"](this, {}, {
        playerId: playerAviary.playerId,
        mass: 0.0001,
        angularVelocity: 0,
        position: playerAviary.position,
        //is copied anyway
        velocity: new _lanceGg.TwoVector(vx, vy)
      });
      crow.message = key;

      if (crow.message === 'up') {
        crow.messageAngle = 0;
      } else if (crow.message === 'right') {
        crow.messageAngle = Math.PI / 2;
      } else if (crow.message === 'left') {
        crow.messageAngle = -Math.PI / 2;
      } else if (crow.message === 'down') {
        crow.messageAngle = Math.PI;
      }

      this.addObjectToWorld(crow);
    } // crow has arrived at a robot; can possibly deliver message

  }, {
    key: "crowArrived",
    value: function crowArrived(crow, robot) {
      if (crow.playerId === robot.playerId) {
        //console.log("crow delivered message " + crow.message);
        if (crow.message === 'up') {
          robot.velocity = new _lanceGg.TwoVector(0, this.robotSpeed);
          robot.angle = crow.messageAngle;
        } else if (crow.message === 'right') {
          robot.velocity = new _lanceGg.TwoVector(this.robotSpeed, 0);
          robot.angle = crow.messageAngle;
        } else if (crow.message === 'left') {
          robot.velocity = new _lanceGg.TwoVector(-this.robotSpeed, 0);
          robot.angle = crow.messageAngle;
        } else if (crow.message === 'down') {
          robot.velocity = new _lanceGg.TwoVector(0, -this.robotSpeed);
          robot.angle = crow.messageAngle;
        } else if (crow.message === 'space') {
          if (!robot.grabberActive) {
            robot.grabberActive = true;
            this.timer.add(this.grabDuration, this.cancelGrab, this, [robot.id]);
          }
        }

        robot.angularVelocity = 0;
        robot.refreshToPhysics();
        this.removeObjectFromWorld(crow.id);
      } else {
        console.log("crow flew over competitor robot");
      }
    }
  }, {
    key: "cancelGrab",
    value: function cancelGrab(robotId) {
      //this.emit('cancelGrab', robotId); // is it necessary to emit this??
      var robot = this.world.queryObject({
        id: robotId
      });

      if (robot && robot instanceof _Robot["default"]) {
        robot.grabberActive = false;
      }
    } // two robots have hit each other TODO dead stop? bounce? damage?

  }, {
    key: "robotCrash",
    value: function robotCrash(robot1, robot2) {
      console.log("robot crash!");
    } // asteroid explosion

  }, {
    key: "explode",
    value: function explode(asteroid, bullet) {
      var _this4 = this;

      // Remove asteroid and bullet
      var asteroidBody = asteroid.physicsObj;
      var level = asteroid.level;
      var x = asteroidBody.position[0];
      var y = asteroidBody.position[1];
      var r = this.asteroidRadius * (this.numAsteroidLevels - level) / this.numAsteroidLevels;
      this.removeObjectFromWorld(asteroid);
      this.removeObjectFromWorld(bullet); // Add new sub-asteroids

      if (level < 3) {
        var angleDisturb = Math.PI / 2 * Math.random();

        var _loop = function _loop(i) {
          var angle = Math.PI / 2 * i + angleDisturb;
          var subAsteroid = new Asteroid(_this4, {}, {
            mass: 10,
            position: new _lanceGg.TwoVector(x + r * Math.cos(angle), y + r * Math.sin(angle)),
            velocity: new _lanceGg.TwoVector(_this4.rand(), _this4.rand())
          });
          subAsteroid.level = level + 1;

          _this4.trace.info(function () {
            return "creating sub-asteroid with radius ".concat(r, ": ").concat(subAsteroid.toString());
          });

          _this4.addObjectToWorld(subAsteroid);
        };

        for (var i = 0; i < 4; i++) {
          _loop(i);
        }
      }
    }
  }]);

  return RoCrowsGameEngine;
}(_lanceGg.GameEngine);

exports["default"] = RoCrowsGameEngine;
//# sourceMappingURL=RoCrowsGameEngine.js.map