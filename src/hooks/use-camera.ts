import { CameraControls } from "@react-three/drei";
import { useCallback } from "react";

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
        middle: 2, // Dolly
        right: 3, // Pan
        wheel: 8, // Zoom
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
        wheel: 0, // Zoom
      },
    },
  },
};

export const useCamera = (controls: CameraControls | null) => {
  const setCameraState = useCallback(
    (state: keyof typeof CAMERA_STATES, animate: boolean = true) => {
      if (!controls) return;

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
    },
    [controls]
  );

  return { setCameraState };
};
