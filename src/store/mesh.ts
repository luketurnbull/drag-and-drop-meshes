import { create } from "zustand";
import { DraggableMesh } from "../utils/types";
import { nanoid } from "nanoid";
import { MESHES } from "../utils/meshes";

export const useMeshStore = create<{
  meshes: DraggableMesh[];
  availableMeshes: DraggableMesh[];
  addMesh: (mesh: Omit<DraggableMesh, "id">) => void;
}>()((set) => ({
  availableMeshes: MESHES,
  meshes: [],
  addMesh: (mesh: Omit<DraggableMesh, "id">) => {
    set((state) => ({
      meshes: [...state.meshes, { id: nanoid(), ...mesh }],
    }));
  },
}));
