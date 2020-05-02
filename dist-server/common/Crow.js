"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

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

var game = null;
var p2 = null;

var Crow = /*#__PURE__*/function (_PhysicalObject2D) {
  _inherits(Crow, _PhysicalObject2D);

  var _super = _createSuper(Crow);

  function Crow() {
    _classCallCheck(this, Crow);

    return _super.apply(this, arguments);
  }

  _createClass(Crow, [{
    key: "onAddToWorld",
    value: function onAddToWorld() {
      game = this.gameEngine;
      p2 = game.physicsEngine.p2;
      this.physicsObj = new p2.Body({
        mass: this.mass,
        damping: 0,
        angularDamping: 0,
        position: [this.position.x, this.position.y],
        velocity: [this.velocity.x, this.velocity.y]
      }); // Create crow shape

      var shape = new p2.Circle({
        radius: game.crowRadius,
        collisionGroup: game.CROW,
        // Belongs to the CROW group
        collisionMask: game.ROBOT // Can only collide with the ROBOT group

      });
      this.physicsObj.addShape(shape);
      game.physicsEngine.world.addBody(this.physicsObj);
    }
  }, {
    key: "onRemoveFromWorld",
    value: function onRemoveFromWorld(gameEngine) {
      game.physicsEngine.world.removeBody(this.physicsObj);
    }
  }, {
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Crow.prototype), "syncTo", this).call(this, other);

      this.message = other.message;
      this.messageAngle = other.messageAngle;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Crow::".concat(_get(_getPrototypeOf(Crow.prototype), "toString", this).call(this), " message=").concat(this.message);
    }
  }, {
    key: "bending",
    // position bending: bend fully to server position in each sync [percent=1.0],
    // unless the position difference is larger than 4.0 (i.e. wrap beyond bounds)
    // no angular velocity bending
    get: function get() {
      return {
        position: {
          max: 4.0
        },
        angularVelocity: {
          percent: 0.0
        }
      };
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        message: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        },
        messageAngle: {
          type: _lanceGg.BaseTypes.TYPES.FLOAT32
        }
      }, _get(_getPrototypeOf(Crow), "netScheme", this));
    }
  }]);

  return Crow;
}(_lanceGg.PhysicalObject2D);

exports["default"] = Crow;
//# sourceMappingURL=Crow.js.map