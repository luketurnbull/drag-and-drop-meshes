import { create } from "zustand";
import { DraggableMesh } from "../utils/types";
import { nanoid } from "nanoid";

type MeshStore = {
  meshes: DraggableMesh[];
  addMesh: (mesh: Omit<DraggableMesh, "id">) => void;
  deleteMesh: (id: string) => void;
};

export const useMeshStore = create<MeshStore>()((set) => ({
  meshes: [],
  addMesh: (mesh: Omit<DraggableMesh, "id">) => {
    set((state) => ({
      meshes: [...state.meshes, { id: nanoid(), ...mesh }],
    }));
  },
  deleteMesh: (id: string) => {
    set((state) => ({
      meshes: state.meshes.filter((mesh) => mesh.id !== id),
    }));
  },
}));
