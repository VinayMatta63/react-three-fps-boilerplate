# Boilerplate for Custom FPS Movement

This project is a basic setup for fps movement in a react-three app which requires @react-three/fiber, @react-three/drei and three dependencies.  

## Component
The main component that enables fps movement is FpsController which can be used as:

    <FpsController>
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
    </FpsController>

It has following sub-components.

### `Floor`

This component is used if we require a floor (square-mesh) beneath the camera and takes the `bound` and `floorMaterial` as props.
where `bound` specifies the distance a player is allowed to move in one direction i.e., half the side of square mesh and `floorMaterial` is an object with attributes color, opacity, metalness and roughness.

By default floor is enabled, to disable it pass `showFloor={false}` to the FpsController.

### `CameraControls`

This is the main component which sets up a perspective camera controls its movement based on key-down/up events and also provides jump, sprint and fly functionalities.
It also ensures that the camera remains inside a specified bounding square and if a user try to go out of bound, it brings them back to the center of bounding square / initial camera position.

It requires `bound`, `velocityFactor` and `cameraInitialPosition` as props where velocityFactor can change the movement speed of camera while cameraInitialPosition can decide the starting position of a new user.

### `ambientLight`

A basic three.js ambient light to see the scene because without any light the mesh-standard material is invisible to the camera.
It can be turned off using `hasAmbiantLight = {false}` and its args can be changed with `ambientLightArgs = {["color", "intensity"]}`.

## Others

### `selector`
A div element with `id="selector"` is necessary as it locks and unlocks the controls on `esc` press. Also it can act as a welcome/ intital loading screen.

Example Website [vinay-matta-Portfolio](https://vinay-matta.web.app/)

More Complex application(with raycasters to simulate in-game keyboard interaction) [portfolio-github](https://github.com/VinayMatta63/threejs-portfolio)
