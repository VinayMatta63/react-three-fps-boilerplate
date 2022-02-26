"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _drei = require("@react-three/drei");

var _fiber = require("@react-three/fiber");

var _three = require("three");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Floor = _ref => {
  let {
    bound,
    floorMaterial
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("mesh", {
    rotation: [-Math.PI / 2, 0, 0]
  }, /*#__PURE__*/_react.default.createElement("planeBufferGeometry", {
    args: [bound * 2, bound * 2]
  }), /*#__PURE__*/_react.default.createElement("meshStandardMaterial", {
    color: floorMaterial.color,
    attach: "material",
    opacity: floorMaterial.opacity,
    roughness: floorMaterial.roughness,
    metalness: floorMaterial.metalness
  }));
};

const CameraControls = _ref2 => {
  let {
    velocityFactor,
    bound,
    cameraInitialPosition
  } = _ref2;
  const [ascend, setAscend] = (0, _react.useState)(false);
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = false;
  const controlsRef = (0, _react.useRef)(null);
  let prevTime = 0;
  const velocity = new _three.Vector3();
  const direction = new _three.Vector3();

  const onKeyDown = function onKeyDown(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;

      case "ShiftLeft":
        velocity.x *= velocityFactor;
        velocity.z *= velocityFactor;
        break;

      case "KeyF":
        setAscend(!ascend);
        break;

      default:
        break;
    }
  };

  const onKeyUp = function onKeyUp(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;

      case "ShiftLeft":
        velocity.x /= velocityFactor;
        velocity.z /= velocityFactor;
        break;

      default:
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  const welcome = document.getElementById("selector");
  const canvas = document.getElementById("canvas");
  (0, _fiber.useFrame)(_ref3 => {
    let {
      clock
    } = _ref3;
    controlsRef.current.addEventListener("lock", () => {
      welcome.style.display = "none";
      canvas.style.display = "block";
    });
    controlsRef.current.addEventListener("unlock", function () {
      welcome.style.display = "flex";
      canvas.style.display = "none";
    }); // Getting the delta time to change location of camera.

    const elapsedTime = clock.getElapsedTime();
    const delta = elapsedTime - prevTime;
    prevTime = elapsedTime; // Reducing speed of camera with frames to give more realistic motion effect.

    velocity.x -= velocity.x * delta * 3.5;
    velocity.z -= velocity.z * delta * 3.5;
    velocity.y -= 9.8 * 100 * delta; // 100.0 = mass
    // Change direction based on the keys pressed by user

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // Movement controls for FPS specified in Three.js Docs.

    if (moveForward || moveBackward) velocity.z -= direction.z * 50 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 50 * delta;
    controlsRef.current.moveRight(-velocity.x * delta);
    controlsRef.current.moveForward(-velocity.z * delta); // Increasing height on pressing F key

    if (!ascend) controlsRef.current.getObject().position.y += velocity.y * delta;else controlsRef.current.getObject().position.y = cameraInitialPosition.y + 40; // new behavior
    // bringing user back to plane after jump limit reached.

    if (controlsRef.current.getObject().position.y < 10) {
      velocity.y = 0;
      controlsRef.current.getObject().position.y = cameraInitialPosition.y;
      canJump = true;
    } // Teleporting user back to middle of plane of goes out of boundary.


    if (controlsRef.current.getObject().position.x > bound || controlsRef.current.getObject().position.z > bound || controlsRef.current.getObject().position.x < -bound || controlsRef.current.getObject().position.z < -bound) {
      controlsRef.current.getObject().position.x = cameraInitialPosition.x;
      controlsRef.current.getObject().position.z = cameraInitialPosition.z;
    }
  });
  return /*#__PURE__*/_react.default.createElement(_drei.PointerLockControls, {
    ref: controlsRef,
    id: "#selector"
  });
};

function FpsController(_ref4) {
  let {
    velocityFactor = 12,
    showFloor = true,
    bound = 20,
    floorMaterial = {
      color: "#80e93d",
      opacity: 0.8,
      roughness: 1,
      metalness: 0
    },
    hasAmbiantLight = true,
    ambientLightArgs = ["white", 10],
    cameraInitialPosition = [0, 5, 0]
  } = _ref4;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, hasAmbiantLight && /*#__PURE__*/_react.default.createElement("ambientLight", {
    args: ambientLightArgs
  }), showFloor && /*#__PURE__*/_react.default.createElement(Floor, {
    bound: bound,
    floorMaterial: floorMaterial
  }), /*#__PURE__*/_react.default.createElement(CameraControls, {
    velocityFactor: velocityFactor,
    bound: bound,
    cameraInitialPosition: {
      x: cameraInitialPosition[0],
      y: cameraInitialPosition[1],
      z: cameraInitialPosition[2]
    }
  }));
}

var _default = FpsController;
exports.default = _default;