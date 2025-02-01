import { Vector3 } from "three";

export type MeshType = "cube" | "sphere" | "cylinder" | "cone" | "pyramid";
export type GhostMesh = {
  type: MeshType;
  position: Vector3;
};
