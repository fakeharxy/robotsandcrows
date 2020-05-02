"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _Aviary = _interopRequireDefault(require("../common/Aviary"));

var _Crow = _interopRequireDefault(require("../common/Crow"));

var _Robot = _interopRequireDefault(require("../common/Robot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var RoCrowsServerEngine = /*#__PURE__*/function (_ServerEngine) {
  _inherits(RoCrowsServerEngine, _ServerEngine);

  var _super = _createSuper(RoCrowsServerEngine);

  function RoCrowsServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, RoCrowsServerEngine);

    _this = _super.call(this, io, gameEngine, inputOptions);
    gameEngine.physicsEngine.world.on('beginContact', _this.handleCollision.bind(_assertThisInitialized(_this)));
    gameEngine.on('releaseCrow', _this.releaseCrow.bind(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(RoCrowsServerEngine, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(RoCrowsServerEngine.prototype), "start", this).call(this); // aviaries replace asteroids, but they can only be created when a player joins
      //this.gameEngine.addAsteroids();

    } // handle a collision on server only

  }, {
    key: "handleCollision",
    value: function handleCollision(evt) {
      // identify the two objects which collided
      var A;
      var B;
      this.gameEngine.world.forEachObject(function (id, obj) {
        if (obj.physicsObj === evt.bodyA) A = obj;
        if (obj.physicsObj === evt.bodyB) B = obj;
      }); // check bullet-asteroid and ship-asteroid collisions

      if (!A || !B) return;
      this.gameEngine.trace.trace(function () {
        return "collision between A=".concat(A.toString());
      });
      this.gameEngine.trace.trace(function () {
        return "collision and     B=".concat(B.toString());
      });
      if (B instanceof _Robot["default"] && A instanceof _Robot["default"]) this.gameEngine.robotCrash(A, B);
      if (A instanceof _Crow["default"] && B instanceof _Robot["default"]) this.gameEngine.crowArrived(A, B);
      if (B instanceof _Crow["default"] && A instanceof _Robot["default"]) this.gameEngine.crowArrived(B, A); //if (A instanceof Robot && B instanceof Asteroid) this.kill(A);
      //if (B instanceof Robot && A instanceof Asteroid) this.kill(B);
      // restart game

      /*
      if (this.gameEngine.world.queryObjects({ instanceType: Asteroid }).length === 0) this.gameEngine.addAsteroids();
      */
    }
  }, {
    key: "releaseCrow",
    value: function releaseCrow(aviary, key) {
      //console.log("player " + aviary.playerId + " pressed " + key);
      this.gameEngine.addCrow(aviary, key);
    }
    /* is this necessary ??
    cancelGrab(robotId) {
        console.log('cancelling grab for robot ' + robotId);
        let robot = this.gameEngine.world.queryObject({ id: robotId });
        if (robot && robot instanceof Robot) {
            robot.
        }
    }
    */

  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(RoCrowsServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      this.gameEngine.addAviary(socket.playerId);
      this.gameEngine.addRobot(socket.playerId);
    }
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      _get(_getPrototypeOf(RoCrowsServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId);

      var _iterator = _createForOfIteratorHelper(this.gameEngine.world.queryObjects({
        playerId: playerId
      })),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var o = _step.value;
          this.gameEngine.removeObjectFromWorld(o.id);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     *  from here onwards is old asteroids code 
     */
    // shooting creates a bullet

  }, {
    key: "shoot",
    value: function shoot(player) {
      var radius = player.physicsObj.shapes[0].radius;
      var angle = player.physicsObj.angle + Math.PI / 2;
      var bullet = new _Crow["default"](this.gameEngine, {}, {
        mass: 0.05,
        position: new _lanceGg.TwoVector(radius * Math.cos(angle) + player.physicsObj.position[0], radius * Math.sin(angle) + player.physicsObj.position[1]),
        velocity: new _lanceGg.TwoVector(2 * Math.cos(angle) + player.physicsObj.velocity[0], 2 * Math.sin(angle) + player.physicsObj.velocity[1]),
        angularVelocity: 0
      });
      var obj = this.gameEngine.addObjectToWorld(bullet);
      this.gameEngine.timer.add(this.gameEngine.bulletLifeTime, this.destroyBullet, this, [obj.id]);
    } // destroy the missile if it still exists

  }, {
    key: "destroyBullet",
    value: function destroyBullet(bulletId) {
      if (this.gameEngine.world.objects[bulletId]) {
        this.gameEngine.trace.trace(function () {
          return "bullet[".concat(bulletId, "] destroyed");
        });
        this.gameEngine.removeObjectFromWorld(bulletId);
      }
    }
  }, {
    key: "kill",
    value: function kill(ship) {
      if (ship.lives-- === 0) this.gameEngine.removeObjectFromWorld(ship.id);
    }
  }]);

  return RoCrowsServerEngine;
}(_lanceGg.ServerEngine);

exports["default"] = RoCrowsServerEngine;
//# sourceMappingURL=RoCrowsServerEngine.js.map