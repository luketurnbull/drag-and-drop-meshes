import { BufferGeometry, Vector3 } from "three";

export interface MeshPart {
  name: string;
  geometry: BufferGeometry;
}

export interface DraggableMesh {
  id: string;
  position: Vector3;
  scale: number;
  parts: MeshPart[];
}
