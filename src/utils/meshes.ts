import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  SphereGeometry,
  TorusKnotGeometry,
} from "three";
import { MeshType } from "./types";

export const MESHES: MeshType[] = ["cube", "sphere", "cylinder", "torus-knot"];

export const GEOMETRY_MAP: Record<MeshType, BufferGeometry> = {
  cube: new BoxGeometry(1, 1, 1),
  sphere: new SphereGeometry(0.5, 100, 100),
  cylinder: new CylinderGeometry(0.5, 0.5, 1, 10, 10),
  "torus-knot": new TorusKnotGeometry(0.5, 0.25, 100, 8),
};
