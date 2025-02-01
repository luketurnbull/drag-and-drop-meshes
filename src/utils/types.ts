import { Vector3 } from "three";

export type MeshType = "cube" | "sphere" | "cylinder" | "torus-knot";

export type DraggableMesh = {
  id: string;
  type: MeshType;
  position: Vector3;
};
