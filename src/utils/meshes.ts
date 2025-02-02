import {
  BoxGeometry,
  CylinderGeometry,
  SphereGeometry,
  TorusKnotGeometry,
  Vector3,
} from "three";
import { DraggableMesh } from "./types";

export const MESHES: DraggableMesh[] = [
  {
    id: "1",
    type: "cube",
    position: new Vector3(0, 0, 0),
    geometry: new BoxGeometry(1, 1, 1),
  },
  {
    id: "2",
    type: "sphere",
    position: new Vector3(1, 0, 0),
    geometry: new SphereGeometry(0.5, 100, 100),
  },
  {
    id: "3",
    type: "cylinder",
    position: new Vector3(2, 0, 0),
    geometry: new CylinderGeometry(0.5, 0.5, 1, 10, 10),
  },
  {
    id: "4",
    type: "torus-knot",
    position: new Vector3(3, 0, 0),
    geometry: new TorusKnotGeometry(0.5, 0.25, 100, 8),
  },
];
