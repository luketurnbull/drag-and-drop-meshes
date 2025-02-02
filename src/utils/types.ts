import { BufferGeometry, Vector3 } from "three";

export type DraggableMesh = {
  id: string;
  position: Vector3;
  geometry: BufferGeometry;
  scale?: number;
};
