import { CameraControls } from "@react-three/drei";

interface CameraState {
  position?: [number, number, number];
  controls: {
    enabled: boolean;
    mouseButtons: {
      left: number;
      middle: number;
      right: number;
      wheel: number;
    };
  };
}

export const CAMERA_STATES: Record<string, CameraState> = {
  default: {
    position: [6, 4, 8],
    controls: {
      enabled: true,
      mouseButtons: {
        left: 1, // Rotate
        middle: 1, // Pan
        right: 1, // Pan
        wheel: 1, // Zoom
      },
    },
  },
  editMode: {
    controls: {
      enabled: true,
      mouseButtons: {
        left: 1, // Rotate
        middle: 0, // Disabled
        right: 0, // Disabled
        wheel: 1, // Zoom
      },
    },
  },
};

export const setCameraState = (
  controls: CameraControls,
  state: keyof typeof CAMERA_STATES,
  animate: boolean = true
) => {
  const config = CAMERA_STATES[state];

  // Set position if defined
  if (config.position) {
    controls.setPosition(
      config.position[0],
      config.position[1],
      config.position[2],
      animate
    );
  }

  // Set control states
  controls.enabled = config.controls.enabled;
  Object.assign(controls.mouseButtons, config.controls.mouseButtons);
};
