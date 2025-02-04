import { create } from "zustand";
import { DraggableMesh, MeshMaterial } from "../utils/types";
import { nanoid } from "nanoid";

type MeshStore = {
  meshes: DraggableMesh[];
  selectedMeshId: string | null;
  addMesh: (mesh: Omit<DraggableMesh, "id">) => void;
  deleteMesh: (id: string) => void;
  editMesh: (id: string) => void;
  resetSelectedMesh: () => void;
  setMeshMaterial: (material: MeshMaterial) => void;
};

export const useMeshStore = create<MeshStore>()((set) => ({
  meshes: [],
  selectedMeshId: null,
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
  editMesh: (id: string) => {
    set(() => ({
      selectedMeshId: id,
    }));
  },
  resetSelectedMesh: () => {
    set(() => ({
      selectedMeshId: null,
    }));
  },
  setMeshMaterial: (material: MeshMaterial) => {
    set((state) => ({
      meshes: state.meshes.map((mesh) =>
        mesh.id === state.selectedMeshId
          ? {
              ...mesh,
              parts: mesh.parts.map((part) => ({
                ...part,
                material: material,
              })),
            }
          : mesh
      ),
    }));
  },
}));
