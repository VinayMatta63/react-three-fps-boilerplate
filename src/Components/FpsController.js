import React, { useRef, useState } from "react";
import { PointerLockControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const Floor = ({ bound, floorMaterial }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[bound * 2, bound * 2]} />
      <meshStandardMaterial
        color={floorMaterial.color}
        attach="material"
        opacity={floorMaterial.opacity}
        roughness={floorMaterial.roughness}
        metalness={floorMaterial.metalness}
      />
    </mesh>
  );
};

const CameraControls = ({ velocityFactor, bound, cameraInitialPosition }) => {
  const [ascend, setAscend] = useState(false);

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = false;
  const controlsRef = useRef(null);

  let prevTime = 0;
  const velocity = new Vector3();
  const direction = new Vector3();
  const onKeyDown = function (event) {
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

  const onKeyUp = function (event) {
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

  useFrame(({ clock }) => {
    controlsRef.current.addEventListener("lock", () => {
      welcome.style.display = "none";
      canvas.style.display = "block";
    });
    controlsRef.current.addEventListener("unlock", function () {
      welcome.style.display = "flex";
      canvas.style.display = "none";
    });

    // Getting the delta time to change location of camera.
    const elapsedTime = clock.getElapsedTime();
    const delta = elapsedTime - prevTime;
    prevTime = elapsedTime;

    // Reducing speed of camera with frames to give more realistic motion effect.
    velocity.x -= velocity.x * delta * 3.5;
    velocity.z -= velocity.z * delta * 3.5;
    velocity.y -= 9.8 * 100 * delta; // 100.0 = mass

    // Change direction based on the keys pressed by user
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    // Movement controls for FPS specified in Three.js Docs.
    if (moveForward || moveBackward) velocity.z -= direction.z * 50 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 50 * delta;
    controlsRef.current.moveRight(-velocity.x * delta);
    controlsRef.current.moveForward(-velocity.z * delta);

    // Increasing height on pressing F key
    if (!ascend)
      controlsRef.current.getObject().position.y += velocity.y * delta;
    else
      controlsRef.current.getObject().position.y = cameraInitialPosition.y + 40; // new behavior

    // bringing user back to plane after jump limit reached.
    if (controlsRef.current.getObject().position.y < 10) {
      velocity.y = 0;
      controlsRef.current.getObject().position.y = cameraInitialPosition.y;
      canJump = true;
    }

    // Teleporting user back to middle of plane of goes out of boundary.
    if (
      controlsRef.current.getObject().position.x > bound ||
      controlsRef.current.getObject().position.z > bound ||
      controlsRef.current.getObject().position.x < -bound ||
      controlsRef.current.getObject().position.z < -bound
    ) {
      controlsRef.current.getObject().position.x = cameraInitialPosition.x;
      controlsRef.current.getObject().position.z = cameraInitialPosition.z;
    }
  });

  return <PointerLockControls ref={controlsRef} id="#selector" />;
};

const FpsController = ({
  velocityFactor = 12,
  showFloor = true,
  bound = 20,
  floorMaterial = {
    color: "#80e93d",
    opacity: 0.8,
    roughness: 1,
    metalness: 0,
  },
  hasAmbiantLight = true,
  ambientLightArgs = ["white", 10],
  cameraInitialPosition = [0, 5, 0],
}) => {
  return (
    <>
      {hasAmbiantLight && <ambientLight args={ambientLightArgs} />}
      {showFloor && <Floor bound={bound} floorMaterial={floorMaterial} />}
      <CameraControls
        velocityFactor={velocityFactor}
        bound={bound}
        cameraInitialPosition={{
          x: cameraInitialPosition[0],
          y: cameraInitialPosition[1],
          z: cameraInitialPosition[2],
        }}
      />
    </>
  );
};

export default FpsController;
