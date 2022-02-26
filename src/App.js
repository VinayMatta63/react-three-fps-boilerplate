import { FirstPersonControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import FpsController from "./Components/FpsController";

const App = () => {
  return (
    <div>
      <div
        id="selector"
        style={{ height: "100vh", width: "100vw", zIndex: 101 }}
      >
        This is the welcome screen
      </div>
      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "black",
        }}
        camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 5, 25] }}
        id="canvas"
      >
        <FpsController
          velocityFactor={12}
          showFloor={true}
          bound={200}
          floorMaterial={{
            color: "#80e93d",
            opacity: 0.8,
            roughness: 1,
            metalness: 0,
          }}
          hasAmbiantLight={true}
          ambientLightArgs={["yellow", 10]}
          cameraInitialPosition={[0, 5, 25]}
        />
      </Canvas>
    </div>
  );
};

export default App;
