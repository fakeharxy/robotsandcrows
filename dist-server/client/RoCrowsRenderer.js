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

var col_aviary = '#35F';
var col_crow = '#ABF';
var col_robot = '#A0A0A0';
var ctx = null;
var game = null;
var canvas = null;

var RoCrowsRenderer = /*#__PURE__*/function (_Renderer) {
  _inherits(RoCrowsRenderer, _Renderer);

  var _super = _createSuper(RoCrowsRenderer);

  function RoCrowsRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, RoCrowsRenderer);

    _this = _super.call(this, gameEngine, clientEngine);
    game = gameEngine; // Init canvas

    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    document.body.insertBefore(canvas, document.getElementById('logo'));
    game.w = canvas.width;
    game.h = canvas.height;
    game.zoom = game.h / game.spaceHeight;
    if (game.w / game.spaceWidth < game.zoom) game.zoom = game.w / game.spaceWidth;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2 / game.zoom;
    ctx.strokeStyle = 'black'; // remove instructions on first input

    setTimeout(_this.removeInstructions.bind(_assertThisInitialized(_this)), 5000);
    return _this;
  }

  _createClass(RoCrowsRenderer, [{
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(RoCrowsRenderer.prototype), "draw", this).call(this, t, dt); // Clear the canvas


      ctx.clearRect(0, 0, game.w, game.h); // Transform the canvas
      // Note that we need to flip the y axis since Canvas pixel coordinates
      // goes from top to bottom, while physics does the opposite.

      ctx.save();
      ctx.translate(game.w / 2, game.h / 2); // Translate to the center TODO: consider if this is best for RoCrows

      ctx.scale(game.zoom, -game.zoom); // Zoom in and flip y axis

      /*
       * Note that flipping the scale like this means all local rotations are also 'flipped'
       * and must be entered as negative.
       */
      // Draw all things

      this.drawBounds();
      game.world.forEachObject(function (id, obj) {
        if (obj instanceof _Aviary["default"]) _this2.drawAviary(obj.physicsObj);else if (obj instanceof _Robot["default"]) _this2.drawRobot(obj);else if (obj instanceof _Crow["default"]) _this2.drawCrow(obj);
      }); // update status and restore

      this.updateStatus();
      ctx.restore();
    }
  }, {
    key: "updateStatus",
    value: function updateStatus() {
      var playerShip = this.gameEngine.world.queryObject({
        playerId: this.gameEngine.playerId
      });

      if (!playerShip) {
        if (this.lives !== undefined) document.getElementById('gameover').classList.remove('hidden');
        return;
      } // update lives if necessary


      if (playerShip.playerId === this.gameEngine.playerId && this.lives !== playerShip.lives) {
        document.getElementById('lives').innerHTML = 'Lives ' + playerShip.lives;
        this.lives = playerShip.lives;
      }
    }
  }, {
    key: "removeInstructions",
    value: function removeInstructions() {
      document.getElementById('instructions').classList.add('hidden');
      document.getElementById('instructionsMobile').classList.add('hidden');
    }
  }, {
    key: "drawRobot",
    value: function drawRobot(robot) {
      var body = robot.physicsObj;
      var size = 0.5 * body.shapes[0].width; // width and height are the same; robot is square

      var armSize = size * 0.4;
      var armLength = !robot.isGrabInactive() ? size * 2 : armSize;
      ctx.save();
      ctx.fillStyle = col_robot;
      ctx.translate(body.position[0], body.position[1]); // Translate to the robot center

      ctx.rotate(-body.angle); // Rotate to robot orientation
      //left arm

      ctx.beginPath();
      ctx.moveTo(-size, -armSize);
      ctx.lineTo(-size - armSize, -armSize);
      ctx.lineTo(-size - armSize, armLength);
      ctx.lineTo(-size, armLength);
      ctx.closePath();
      ctx.stroke();
      ctx.fill(); //right arm

      ctx.beginPath();
      ctx.moveTo(size, -armSize);
      ctx.lineTo(size + armSize, -armSize);
      ctx.lineTo(size + armSize, armLength);
      ctx.lineTo(size, armLength);
      ctx.closePath();
      ctx.stroke();
      ctx.fill(); //body

      ctx.beginPath();
      ctx.moveTo(-size, -size);
      ctx.lineTo(-size, size);
      ctx.lineTo(size, size);
      ctx.lineTo(size, -size);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      /*
      //debug A - grab point
      ctx.fillStyle = "#F55";
      ctx.beginPath();
      ctx.arc(0, game.grabReach, game.robotSize / 10, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fill();
      //end debug A
      */

      ctx.restore();
      /*debug B - grab point as calculated
      let grabVector = { x: body.position[0] + game.grabReach * Math.sin(body.angle), y:body.position[1] + game.grabReach * Math.cos(body.angle) };
      ctx.save();
      ctx.fillStyle = "#55F";
      ctx.beginPath();
      ctx.arc(grabVector.x, grabVector.y, game.robotSize / 10, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      //end debug B
      */
    }
  }, {
    key: "drawAviary",
    value: function drawAviary(body) {
      ctx.save(); //ctx.translate(body.position[0], body.position[1]);  // Translate to the center
      //ctx.rotate(-body.angle);

      ctx.fillStyle = col_aviary;
      ctx.beginPath();
      ctx.arc(body.position[0], body.position[1], game.aviaryRadius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }, {
    key: "drawCrow",
    value: function drawCrow(crow) {
      var body = crow.physicsObj;
      ctx.save();
      ctx.translate(body.position[0], body.position[1]); // Translate to the center
      //crow

      ctx.fillStyle = col_crow;
      ctx.beginPath();
      ctx.arc(0, 0, game.crowRadius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
      ctx.fill(); //direction indicator

      if (crow.messageAngle || crow.messageAngle === 0) {
        ctx.rotate(-crow.messageAngle);
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(-game.crowRadius / 2, 0);
        ctx.lineTo(0, game.crowRadius);
        ctx.lineTo(game.crowRadius / 2, 0);
        ctx.closePath(); //ctx.stroke();

        ctx.fill();
      }

      ctx.restore();
    }
  }, {
    key: "drawBounds",
    value: function drawBounds() {
      ctx.beginPath();
      ctx.moveTo(-game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.lineTo(-game.spaceWidth / 2, game.spaceHeight / 2);
      ctx.lineTo(game.spaceWidth / 2, game.spaceHeight / 2);
      ctx.lineTo(game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.lineTo(-game.spaceWidth / 2, -game.spaceHeight / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }]);

  return RoCrowsRenderer;
}(_lanceGg.Renderer);

exports["default"] = RoCrowsRenderer;
//# sourceMappingURL=RoCrowsRenderer.js.map