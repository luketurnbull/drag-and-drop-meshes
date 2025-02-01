import { create } from "zustand";
import { DraggableMesh } from "../utils/types";
import { Vector3 } from "three";
import { nanoid } from "nanoid";

export const useMeshStore = create<{
  meshes: DraggableMesh[];
  addMesh: (mesh: Omit<DraggableMesh, "id">) => void;
}>()((set) => ({
  meshes: [
    {
      id: "1",
      type: "cube",
      position: new Vector3(0, 0, 0),
    },
    {
      id: "2",
      type: "sphere",
      position: new Vector3(1, 0, 0),
    },
  ],
  addMesh: (mesh: Omit<DraggableMesh, "id">) => {
    set((state) => ({
      meshes: [...state.meshes, { id: nanoid(), ...mesh }],
    }));
  },
}));
