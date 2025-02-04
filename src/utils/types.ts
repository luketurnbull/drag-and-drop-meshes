import { BufferGeometry, Texture, Vector3 } from "three";

export type MeshMaterial = "redPlaid" | "denim" | "houndstooth";

export type MeshPart = {
  name: string;
  geometry: BufferGeometry;
  material?: MeshMaterial;
};

export type DraggableMesh = {
  id: string;
  position: Vector3;
  scale: number;
  parts: MeshPart[];
};

export type TextureSet = {
  albedo: Texture;
  normal: Texture;
  metallic: Texture;
  ao: Texture;
  height: Texture;
  roughness?: Texture;
};

export type MaterialTextures = {
  redPlaid: TextureSet;
  denim: TextureSet;
  houndstooth: TextureSet;
};
